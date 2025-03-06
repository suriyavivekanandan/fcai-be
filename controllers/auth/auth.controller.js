import config from '@/config'
import { Token } from '@/models/token.model'
import { User } from '@/models/user.model'
import { sendEmailViaTemplate } from '@/utils/mail.controller'
import crypto, { randomUUID } from 'crypto'
import isEmpty from 'is-empty'
import ms from 'ms'
import jwt from 'jsonwebtoken'
import generateOTP from '@/utils/generateOtp'
import { compareOTP, hashingOTP } from '@/security/password'



const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found while generating tokens');
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        if (!accessToken || !refreshToken) {
            throw new Error('Failed to generate tokens');
        }

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Error generating tokens:', error);
        throw new Error('Something went wrong while generating tokens');
    }
};

export const generateRefeshToken = async (req, res) => {
    try {
        const { cookies } = req

        const isTokenExistent = await Token.findOne({
            refreshToken: cookies.refreshToken,
        })

        if (isEmpty(isTokenExistent)) {
            return res.status(401).json({ success: false, message: 'Session Expired', statusCode: 401 })
        }

        const user = await User.findOne({ _id: isTokenExistent.userId }).lean()


        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
        isTokenExistent.accessToken = accessToken
        isTokenExistent.refreshToken = refreshToken
        await isTokenExistent.save()

        const options = {
            httpOnly: true,
            secure: true,
            samesite: 'none',
            partitioned: true,
            expiresIn: 24 * 60 * 60 * 1000 * 7,
            maxAge: 24 * 60 * 60 * 1000 * 7,
        }

        res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN)
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

        return res.status(200).cookie('accessToken', accessToken, options).cookie('refreshToken', refreshToken, options).json({
            statusCode: 200,
            data: {
                user,
                accessToken,
                refreshToken,
            },
        })
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            error: error.message,
            success: false,
        })
    }
}

export const registerUser = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
        } = req.body;

        // Input validation
        if ([firstName, lastName, email, password].some((field) => field?.trim() === '')) {
            return res.status(400).json({
                statusCode: 400,
                message: 'All fields are required',
                success: false,
            });
        }

        // Check for existing user
        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(409).json({
                statusCode: 409,
                message: 'Email already exist, Please login to continue.',
                success: false,
            });
        }


        const plainTextOtp = generateOTP();
        const secret = crypto.randomBytes(32).toString('hex');
        const hashedOtp = await hashingOTP(plainTextOtp, secret);

        const user = new User({
            firstName,
            lastName,
            email,
            password,
            isEmailVerified: false,
            isGooglelogin: false,
            otp: hashedOtp.hash,
            expiresAt: new Date(Date.now() + ms(config.OTP_EXPIRY))
        })


    
        await user.save({ validateBeforeSave: false });


        const emailContext = {
            identifier: 'REGISTERATION',
            to: user.email.toLowerCase(),
            content: {
                name: user.firstName,
                Otp: plainTextOtp,
            },
        };

        const emailSent = await sendEmailViaTemplate(emailContext);
        if (!emailSent) {
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({
                success: false,
                message: 'Failed to send verification email'
            });
        }

        const createdUser = await User.findById(user._id).select(
            '-password -refreshToken -otp -secret -expiresAt'
        );

        if (!createdUser) {
            return res.status(500).json({
                statusCode: 500,
                message: 'Something went wrong while registering the user',
                success: false,
            });
        }

        return res.status(201).json({
            statusCode: 201,
            data: {
                user: createdUser,
            },
            message: 'User registered successfully. Please check your email for OTP',
            success: true,
        });

    } catch (error) {
        console.error('Error in registerUser:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            error: error.message,
            success: false,
        });
    }
};


export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required',
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Email is not found. Please register and explore',
            });
        }

        if (!user.expiresAt || user.expiresAt < new Date ){
            return res.status(400).json({
                success: false,
                message: 'OTP has been expired',
            });
        }

        const otpMatch = await compareOTP(otp, user.otp);

        if (!otpMatch.status) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }

        user.isEmailVerified = true;
        user.otp = null;
        user.secret = null;
        user.expiresAt = null;

        await user.save();

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
        const sessionId = randomUUID();

        // Create the token without the mode field
        const token = new Token({
            userId: user._id,
            accessToken,
            refreshToken,
            sessionId,
        });

        const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

        await token.save();

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            partitioned: true,
            maxAge: 24 * 60 * 60 * 1000 * 7,
        };

        res.header('Access-Control-Allow-Origin', config.CORS_ORIGIN);
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json({
                statusCode: 200,
                data: {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                message: 'User logged in successfully',
                success: true,
            });

    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            error: error.message,
            success: false,
        });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(email)

        if (!email) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Email is required',
                success: false,
            })
        }
        const user = await User.findOne({ email: email?.toLowerCase() })

        if (!user) {
            return res.status(400).json({
                statusCode: 400,
                message: 'User does not exist',
                success: false,
            })
        }

        const isPasswordValid = await user.isPasswordCorrect(password)

        if (!isPasswordValid) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Invalid user credentials',
                success: false,
            })
        }

        if (!user.Invitations) {
            user.Invitations = true
            await user.save()
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
        const sessionId = randomUUID()

        const token = new Token({
            userId: user._id,
            accessToken,
            refreshToken,
            sessionId,
        })

        if (!user.isEmailVerified) {
            return res.status(400).json({
                statusCode: 400,
                message: 'User is not a verified user',
                success: false,
            })
        }

        const loggedInUser = await User.findById(user._id).select('-password -refreshToken')

   
        await token.save()

        const options = {
            httpOnly: true,
            secure: true,
            samesite: 'none',
            partitioned: true,
            expiresIn: 24 * 60 * 60 * 1000 * 7,
            maxAge: 24 * 60 * 60 * 1000 * 7,
        }
        res.header('Access-Control-Allow-Origin', config.CORS_ORIGIN)

        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json({
                statusCode: 200,
                data: {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                message: 'User logged In Successfully',
                success: true,
            })
    } catch (error) {
        console.error('Error in loginUser:', error)
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            error: error.message,
            success: false,
        })
    }
}




export const logoutUser = async (req, res) => {
    console.log('req: ', req);
    try {
        // const user = jwt.decode(req.cookies.refreshToken)
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1,
                },
            },
            {
                new: true,
            },
        )

        const options = {
            httpOnly: true,
            secure: true,
            samesite: 'none',
            partitioned: true,
            expiresIn: 24 * 60 * 60 * 1000 * 7,
            maxAge: 24 * 60 * 60 * 1000 * 7,
        }

        res.clearCookie('accessToken', options)
        res.clearCookie('refreshToken', options)

        return res.status(200).json({
            success: true,
            message: 'User logged out successfully',
            clearLocalStorage: true,
        })
    } catch (error) {
        console.error('Error in logoutUser:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        })
    }
}



