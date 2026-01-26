"use server";

/**
 * This module provides functions to manage collaborative documents using Liveblocks.
 * - `CreateDocument`: Creates a new document (room) with metadata and user permissions.
 * - `getDocument`: Retrieves a document (room) and verifies access for a specific user.
 * - `updateDocument`: Updates the metadata of a document (room) with a new title.
 */

import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { getAccessType, parseStringify } from "../utils";
import { redirect } from "next/navigation";

/**
 * Creates a new document (room) with metadata and user access permissions.
 */
export const CreateDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  // Step 1: Generate a unique room ID using nanoid
  const roomId = nanoid();

  try {
    // Step 2: Define metadata for the room (e.g., creator info and title)
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled document",
    };

    // Step 3: Define user-specific access permissions
    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"], // Grant write access to the creator
    };

    // Step 4: Create the room on Liveblocks with metadata and default access settings
    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: [], // Default access for all users
    });

    // Step 5: Revalidate the cache for the relevant path
    revalidatePath("/");

    // Step 6: Serialize the room data for return
    return parseStringify(room);
  } catch (error) {
    // Step 7: Handle errors and log them to the console
    console.error(`Failed to create document: ${error}`);
  }
};

/**
 * Retrieves a document (room) and checks if the user has access to it.
 */
export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    // Step 1: Fetch the room details from Liveblocks
    const room = await liveblocks.getRoom(roomId);

    // Step 2: Check if the user has access based on their user ID
    const hasAccess = Object.keys(room.usersAccesses).includes(userId);

    // Step 3: Throw an error if the user does not have access
    if (!hasAccess) {
      throw new Error("You do not have access to this document");
    }

    // Step 4: Serialize the room data for return
    return parseStringify(room);
  } catch (error) {
    // Step 5: Handle errors and log them to the console
    console.log(`Error happened while getting a room: ${error}`);
  }
};

export const updateDocument = async (roomId: string, title: string) => {
  try {
    const updateRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });
    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updateRoom);
  } catch (error) {
    console.error(`Failed to update title: ${error}`);
  }
};

export const getDocuments = async (email: string) => {
  try {
    // Step 1: Fetch the room details from Liveblocks
    const rooms = await liveblocks.getRooms({ userId: email });

    return parseStringify(rooms);
  } catch (error) {
    // Step 5: Handle errors and log them to the console
    console.log(`Error happened while getting a rooms: ${error}`);
  }
};

export const updateDocumentAccess = async ({
  roomId,
  email,
  userType,
  updatedBy,
}: ShareDocumentParams) => {
  try {
    const usersAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType,
    };

    const room = await liveblocks.updateRoom(roomId, {
      usersAccesses,
    });

     if (room) {
       const notificationId = nanoid();

       await liveblocks.triggerInboxNotification({
         userId: email,
         kind: "$documentAccess",
         subjectId: notificationId,
         activityData: {
           userType,
           title: `You have been granted ${userType} access to the document by ${updatedBy.name}`,
           updatedBy: updatedBy.name,
           avatar: updatedBy.avatar,
           email: updatedBy.email,
         },
         roomId,
       });
     }
     
    revalidatePath(`/documents/${roomId}`);
    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while updating document access: ${error}`);
  }
};

export const removeCollaborator = async ({
  roomId,
  email,
}: {
  roomId: string;
  email: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    if (room.metadata.email === email) {
      throw new Error("You cannot remove yourself from the document");
    }

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: {
        [email]: null,
      },
    });

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error happened while removing collaborator: ${error}`);
  }
};

export const deleteDocument = async (roomId: string) => {
  try {
    await liveblocks.deleteRoom(roomId);
    revalidatePath("/");
    redirect("/");
  } catch (error) {
    console.log(`Error happened while deleting a room: ${error}`);
  }
};
