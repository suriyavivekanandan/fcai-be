export const DBNAME = "Pilot";


export const STATUS = ["active", "inactive"];

export const UserRolesEnum = {
  OWNER: "owner",
  MEMBER: "member",
};

export const WorkspaceMemberRoleEnum= {
  ADMIN  :'admin',
  MEMBER :'member',
  VIEWER :'viewer'
}

export const ProjectMemberRoleEnum= {
  ADMIN  :'admin',
  MEMBER :'member',
  VIEWER :'viewer'
}
export const ChannelMemberRoleEnum= {
  ADMIN  :'admin',
  MEMBER :'member',
  VIEWER :'viewer'
}

export const TaskStatusEnum={
  BACKLOG :"BACKLOG",
  TODO : "TODO",
  IN_PROGRESS :"IN_PROGRESS",
  IN_REVIEW : "IN_REVIEW",
  DONE : "DONE"
}
export const StateEnum = {
  FREE: "free",
  BUSY: "busy",
};

export const StateCategory = {
  TIME: "time",
  ALLDAY: "allday",
};
export const StateCalender = {
  COMPANY: "company",
  PRIVATE: "private",
};

export const planTypeEnum = {
  FREE: "free",
  PRO: "pro",
  ENTERPRISE: "enterprise",
};
export const UserStatusEnum = {
  INACTIVE: "inactive",
  ACTIVE: "active",
  BLOCKED: "blocked",
  DELETE: "deleted",
};

export const UserModeEnum = {
  ADD_ORGANISATION: "Add_Organization",
  CHANGE_PASSWORD: "Change_Password",
  PASSWORD_CHANGED: "Password_Changed",
};

export const StatusEnum = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};



export const ChatEventEnum = {
  // Connection events
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",
  SOCKET_ERROR_EVENT: "socketError",
  
  // Chat room events
  JOIN_CHAT_EVENT: "joinChat",
  LEAVE_CHAT_EVENT: "leaveChat",
  
  // Typing events
  TYPING_EVENT: "typing",
  STOP_TYPING_EVENT: "stopTyping",
  
  // Message events
  MESSAGE_RECEIVED_EVENT: "messageReceived",
  MESSAGE_DELETE_EVENT: "messageDeleted",
  MESSAGE_UPDATE_EVENT: "messageUpdated",
  MESSAGE_READ_EVENT: "messageRead",
  
  // Channel events
  NEW_CHAT_EVENT: "newChat",
  UPDATE_GROUP_NAME_EVENT: "updateGroupName"
};

export const AvailableUserRoles = Object.values(UserRolesEnum);
export const AvailableUserModes = Object.values(UserModeEnum);
export const AvailableWorkspaceRoles = Object.values(WorkspaceMemberRoleEnum);
export const AvailableProjectRoles=Object.values(ProjectMemberRoleEnum);
export const AvailableTaskStatusEnum=Object.values(TaskStatusEnum);



export const AvailableUserStatusEnum = Object.values(UserStatusEnum);
export const AvailableChannelEnum = Object.values(ChannelMemberRoleEnum);


export const AvailablePlanTypeEnum = Object.values(planTypeEnum);
export const AvailableStatusEnum = Object.values(StatusEnum);
export const AvailableStateEnum = Object.values(StateEnum);
export const AvailableStateCategory = Object.values(StateCategory);
export const AvailableStateCalender = Object.values(StateCalender);
export const AvailableChatEvents = Object.values(ChatEventEnum);


export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000;
