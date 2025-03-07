exports.getAvailableFood = (req, res) => {
  res.status(200).json({ message: "Available food data" });
};

exports.getAllBookings = (req, res) => {
  res.status(200).json({ message: "All bookings data" });
};

exports.createBooking = (req, res) => {
  res.status(201).json({ message: "Booking created successfully" });
};
