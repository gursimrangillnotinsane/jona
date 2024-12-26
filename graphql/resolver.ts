import prismaClient from '../lib/prisma';


// Define subscription events
const ENTRY_UPDATED = "ENTRY_UPDATED";

export const resolvers = {

    Query: {
        async entries(_: any, args: any, context: any) {
            try {
                const entries = await prismaClient.dairy.findMany({});
                return entries || [];
            } catch (error) {
                console.error("Error fetching entries:", error);
                throw new Error("Failed to fetch entries.");
            }
        },

        async entry(_: any, args: any, context: any) {
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
        async createEntry(_: any, args: any, context: any) {
            const { title, content, from, to, user } = args;
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
                        user,
                    },
                });

                // Publish the event to subscribers


                return entry;
            } catch (error) {
                console.error("Error creating entry:", error);
                throw new Error("Failed to create entry.");
            }
        },

        async editEntry(_: any, args: any, context: any) {
            const { id, title, content, from, to, user } = args;
            if (!id || !title || !content || !from || !to || !user) {
                throw new Error("All fields (id, title, content, from, to, user) are required.");
            }
            try {
                const entry = await prismaClient.dairy.update({
                    where: { id },
                    data: {
                        title,
                        content,
                        from,
                        to,
                        date: new Date().toLocaleDateString('en-GB'),
                        user,
                    },
                });

                // Publish the event to subscribers


                return entry;
            } catch (error) {
                console.error("Error updating entry:", error);
                throw new Error("Failed to update entry.");
            }
        },

        async deleteEntry(_: any, args: any, context: any) {
            const { id } = args;
            if (!id) {
                throw new Error("Field 'id' is required and must be an integer.");
            }
            try {
                const entry = await prismaClient.dairy.delete({
                    where: { id: parseInt(id, 10) },
                });

                // Publish the event to subscribers


                return entry;
            } catch (error) {
                console.error("Error deleting entry:", error);
                throw new Error("Failed to delete entry.");
            }
        },
    },
};

export default resolvers;
