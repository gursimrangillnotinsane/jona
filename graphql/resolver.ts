import prismaClient from '../lib/prisma'

// reslovers for the graphql schema
export const resolvers = {
    // returns all
    Query: {
        // Returns all dairy entries
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
            }
            catch (error) {
                console.error("Error fetching entry:", error);
                throw new Error("Failed to fetch entry.");
            }
        },
    },

    // 
    Mutation: {
        // Creates a new dairy entry
        async createEntry(_: any, args: any, context: any) {
            const { title, content, from, to } = args;
            if (!title || !content || !from || !to) {
                throw new Error("All fields (title, date, content) are required.");
            }
            try {
                console.log("Creating entry:", new Date().toISOString(), content);
                const entry = await prismaClient.dairy.create({
                    data: {
                        title,
                        date: new Date().toLocaleDateString('en-GB'),
                        content,
                        from,
                        to
                    },
                });
                return entry;
            } catch (error) {
                console.error("Error creating entry:", error);
                throw new Error("Failed to create entry.");
            }
        },

        async editEntry(_: any, args: any, context: any) {
            const { id, title, content, from, to } = args;
            if (!id || !title || !content || !from || !to) {
                throw new Error("All fields (id, title, content) are required.");
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
                    },
                });
                return entry;
            } catch (error) {
                console.error("Error updating entry:", error);
                throw new Error("Failed to update entry.");
            }
        },


        async deleteEntry(_: any, args: any, context: any) {
            const { id } = args; // 'id' is now expected to be an Int
            if (!id) {
                throw new Error("Field 'id' is required and must be an integer.");
            }
            try {
                const entry = await prismaClient.dairy.delete({
                    where: { id: parseInt(id, 10) }, // Ensure the value is parsed as an integer
                });
                return entry;
            } catch (error) {
                console.error("Error deleting entry:", error);
                throw new Error("Failed to delete entry.");
            }
        }
    },
};

export default resolvers