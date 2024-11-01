import {
  query,
  update,
  text,
  nat64,
  Record,
  StableBTreeMap,
  Result,
  Err,
  Ok,
  Vec,
  Null,
  Opt,
  bool,
  None,
  Canister,
  ic,
  Variant,
  Some,
} from "azle";
import { v4 as uuidv4 } from "uuid";

// Define UserRole Enum
const UserRole = Variant({
  Admin: Null,
  ITSupport: Null,
  User: Null,
});

// Define User struct
const User = Record({
  id: text,
  username: text,
  role: UserRole,
  created_at: text,
});

// Define TicketStatus Enum
const TicketStatus = Variant({
  Open: Null,
  InProgress: Null,
  Closed: Null,
});

// Define TicketPriority Enum
const TicketPriority = Variant({
  Low: Null,
  Medium: Null,
  High: Null,
});

// Define Ticket struct
const Ticket = Record({
  id: text,
  userId: text,
  title: text,
  description: text,
  status: TicketStatus,
  priority: TicketPriority,
  created_at: text,
  created_by: text,
  assigned_to: Opt(text),
});

// Define ITAsset struct
const ITAsset = Record({
  id: text,
  asset_name: text,
  asset_type: text,
  purchase_date: nat64,
  assigned_to: text,
  approx_value: nat64,
  depreciation_rate: nat64,
});

const Comment = Record({
  id: text,
  ticketId: text,
  userId: text,
  content: text,
  created_at: text,
});

const AssetMaintenanceRecord = Record({
  id: text,
  assetId: text,
  maintenanceType: text,
  description: text,
  cost: nat64,
  date: nat64,
});

// Payloads for creating tickets, users, and assets
const TicketPayload = Record({
  userId: text,
  title: text,
  description: text,
  priority: TicketPriority,
});

const AssignTicketPayload = Record({
  ticketId: text,
  userId: text,
});

const UserPayload = Record({
  username: text,
  role: UserRole,
});

const ITAssetPayload = Record({
  asset_name: text,
  asset_type: text,
  purchase_date: nat64,
  assigned_to: text,
  approx_value: nat64,
  depreciation_rate: nat64,
});

// Comments payload
const CommentPayload = Record({
  ticketId: text,
  userId: text,
  content: text,
});

const UpdateTicketStatusPayload = Record({
  ticketId: text,
  userId: text,
  newStatus: TicketStatus,
});

// Asset Maintenance Record payload
const AssetMaintenanceRecordPayload = Record({
  assetId: text,
  maintenanceType: text,
  description: text,
  cost: nat64,
  date: nat64,
});

// reportType Enum
const ReportType = Variant({
  OpenTickets: Null,
  ClosedTickets: Null,
  InProgressTickets: Null,
  AssetUtilization: Null,
});

// generateReport payload
const GenerateReportPayload = Record({
  reportType: ReportType,
});

// Storage initialization
const ticketStorage = StableBTreeMap(0, text, Ticket);
const userStorage = StableBTreeMap(1, text, User);
const itAssetStorage = StableBTreeMap(2, text, ITAsset);
const commentStorage = StableBTreeMap(3, text, Comment);
const assetMaintenanceRecordStorage = StableBTreeMap(
  4,
  text,
  AssetMaintenanceRecord
);

// Helper functions
function isAdmin(userId: text): boolean {
  const userOpt = userStorage.get(userId);
  if ("None" in userOpt) {
    return false;
  }
  return "Admin" in userOpt.Some.role;
}

function isITSupport(userId: text): boolean {
  const userOpt = userStorage.get(userId);
  if ("None" in userOpt) {
    return false;
  }
  return "ITSupport" in userOpt.Some.role;
}

// Utility function to generate current timestamp
function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// Canister Definition
export default Canister({
  // Create a new user
  createUser: update([UserPayload], Result(User, text), (payload) => {
    if (!payload.username) {
      return Err("Username is required.");
    }

    // Ensure that the username is unique
    const existingUsers = userStorage.values();

    for (const user of existingUsers) {
      if (user.username === payload.username) {
        return Err("Username already exists, try another one.");
      }
    }

    const userId = uuidv4();
    const user = {
      id: userId,
      username: payload.username,
      role: payload.role,
      created_at: getCurrentTimestamp(),
    };

    userStorage.insert(userId, user);
    return Ok(user);
  }),

  // Get a user by ID
  getUserById: query([text], Result(User, text), (userId) => {
    const userOpt = userStorage.get(userId);
    if ("None" in userOpt) {
      return Err("User not found.");
    }
    return Ok(userOpt.Some);
  }),

  // Get all users
  getAllUsers: query([], Result(Vec(User), text), () => {
    const users = userStorage.values();
    if (users.length === 0) {
      return Err("No users found.");
    }
    return Ok(users);
  }),

  // Create a new ticket
  createTicket: update([TicketPayload], Result(Ticket, text), (payload) => {
    if (!payload.userId || !payload.title || !payload.description) {
      return Err("User ID, title, and description are required.");
    }

    // Check if the user exists
    const userOpt = userStorage.get(payload.userId);
    if ("None" in userOpt) {
      return Err(`User with ID ${payload.userId} not found.`);
    }

    // Check if the user is IT support or an Admin
    if (!isITSupport(payload.userId) && !isAdmin(payload.userId)) {
      return Err("Only IT support and Admins can create tickets.");
    }

    // Generate a new ticket ID
    const ticketId = uuidv4();

    // Create the ticket object
    const ticket = {
      id: ticketId,
      userId: payload.userId,
      title: payload.title,
      description: payload.description,
      status: { Open: null }, // Use enum directly
      priority: payload.priority,
      created_at: getCurrentTimestamp(),
      created_by: payload.userId,
      assigned_to: None,
    };

    ticketStorage.insert(ticketId, ticket);
    return Ok(ticket); // Return the created ticket
  }),

  // Assign a ticket to a user
  assignTicket: update(
    [AssignTicketPayload],
    Result(Ticket, text),
    (payload) => {
      const ticketOpt = ticketStorage.get(payload.ticketId);
      if ("None" in ticketOpt) {
        return Err("Ticket not found.");
      }

      const ticket = ticketOpt.Some;

      // Check if the user exists
      const userOpt = userStorage.get(payload.userId);
      if ("None" in userOpt) {
        return Err(`User with ID ${payload.userId} not found.`);
      }

      // Check if the user is an IT support
      if (!isITSupport(payload.userId)) {
        return Err("Only IT support can assign tickets.");
      }

      const updatedTicket = {
        ...ticket,
        assigned_to: Some(payload.userId),
      };

      ticketStorage.insert(payload.ticketId, updatedTicket);
      return Ok(updatedTicket);
    }
  ),

  // Get all tickets
  getTickets: query([], Result(Vec(Ticket), text), () => {
    const tickets = ticketStorage.values();
    if (tickets.length === 0) {
      return Err("No tickets found.");
    }
    return Ok(tickets);
  }),

  // Get a specific ticket by ID
  getTicketById: query([text], Result(Ticket, text), (ticketId) => {
    const ticketOpt = ticketStorage.get(ticketId);
    if ("None" in ticketOpt) {
      return Err(`Ticket with ID ${ticketId} not found.`);
    }
    return Ok(ticketOpt.Some);
  }),

  // Add a comment to a ticket
  addCommentToTicket: update(
    [CommentPayload],
    Result(Comment, text),
    (payload) => {
      const ticketOpt = ticketStorage.get(payload.ticketId);
      if ("None" in ticketOpt) {
        return Err("Ticket not found.");
      }

      const commentId = uuidv4();
      const comment = {
        id: commentId,
        ticketId: payload.ticketId,
        userId: payload.userId,
        content: payload.content,
        created_at: getCurrentTimestamp(),
      };

      commentStorage.insert(commentId, comment);
      return Ok(comment);
    }
  ),

  // Get comments for a specific ticket
  getCommentsForTicket: query(
    [text],
    Result(Vec(Comment), text),
    (ticketId) => {
      const allComments = commentStorage.values();
      const ticketComments = allComments.filter(
        (comment) => comment.ticketId === ticketId
      );

      if (ticketComments.length === 0) {
        return Err("No comments found for this ticket.");
      }
      return Ok(ticketComments);
    }
  ),

