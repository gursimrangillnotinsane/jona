import prismaClient from '../lib/prisma';

import { Context } from '../app/api/route';
// Define subscription events
const ENTRY_UPDATED = "ENTRY_UPDATED";

export const resolvers = {

    Query: {
        async entries(_: any, args: any, context: Context) {
            const { user } = context; // Access user from context
            console.log('user', user)
            if (!user) {
                throw new Error("Authentication required.");
            }
            try {
                const entries = await prismaClient.dairy.findMany({
                    orderBy: {
                        id: 'desc', // Use 'id' or 'date' or another field to sort in descending order
                    },
                });
                return entries || [];
            } catch (error) {
                if (error instanceof Error) {
                    console.log("Error: ", error.stack)
                }
                throw new Error("Failed to fetch entries.");
            }
        },

        async entry(_: any, args: any, context: Context) {
            const { user } = context; // Access user from context
            if (!user) {
                throw new Error("Authentication required.");
            }
            try {
                const entry = await prismaClient.dairy.findUnique({
                    where: { id: parseInt(args.id, 10) },
                });
                return entry;
            } catch (error) {
                console.error("Error fetching entry:", error);
                throw new Error("Failed to fetch entry.");
            }
        },
    },

    Mutation: {
        async createEntry(_: any, args: any, context: Context) {
            const { user } = context; // Access user from context
            console.log('user', user)
            if (!user) {
                throw new Error("Authentication required.");
            }
            const { title, content, from, to } = args;
            if (!title || !content || !from || !to || !user) {
                throw new Error("All fields (title, date, content, from, to, user) are required.");
            }
            try {
                const entry = await prismaClient.dairy.create({
                    data: {
                        title,
                        date: new Date().toLocaleDateString('en-GB'),
                        content,
                        from,
                        to,
                        user: user.sub || '',
                    },
                });

                // Publish the event to subscribers


                return entry;
            } catch (error) {
                console.error("Error creating entry:", error);
                throw new Error("Failed to create entry.");
            }
        },

        async editEntry(_: any, args: any, context: Context) {
            const { user } = context; // Access user from context
            if (!user) {
                throw new Error("Authentication required.");
            }
            const { id, title, content, from, to, } = args;
            if (!id || !title || !content || !from || !to || !user) {
                throw new Error("All fields (id, title, content, from, to, user) are required.");
            }

            try {
                const entry = await prismaClient.dairy.findUnique({
                    where: { id },
                });

                if (!entry || entry.user !== user.sub) {
                    throw new Error("You are not authorized to edit this entry.");
                }
                const updatedEntry = await prismaClient.dairy.update({
                    where: { id },
                    data: {
                        title,
                        content,
                        from,
                        to,
                        date: new Date().toLocaleDateString('en-GB'),
                        user: user.sub,
                    },
                });

                // Publish the event to subscribers


                return updatedEntry;
            } catch (error) {
                console.error("Error updating entry:", error);
                throw new Error("Failed to update entry.");
            }
        },

        async deleteEntry(_: any, args: any, context: Context) {
            const { user } = context; // Access user from context
            if (!user) {
                throw new Error("Authentication required.");
            }
            const { id } = args;
            if (!id) {
                throw new Error("Field 'id' is required and must be an integer.");
            }
            try {
                const entry = await prismaClient.dairy.findUnique({
                    where: { id },
                });

                if (!entry) {
                    throw new Error("Entry not found.");
                }

                if (entry.user !== user.sub) {
                    throw new Error("You are not authorized to delete this entry.");
                }

                const deletedEntry = await prismaClient.dairy.delete({
                    where: { id },
                });

                return deletedEntry;
            } catch (error) {
                console.error("Error deleting entry:", error);
                throw new Error("Failed to delete entry.");
            }
        },
    },
};

export default resolvers;
