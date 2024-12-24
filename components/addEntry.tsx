"use client";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CREATE_ENTRY = gql`
  mutation ($title: String!, $content: String!) {
    createEntry(title: $title, content: $content) {
      id
      title
      content
    }
  }
`;

const AddEntry = () => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [createEntryMutation] = useMutation(CREATE_ENTRY);
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false); // Added loading state

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when submission starts
        try {
            await createEntryMutation({ variables: { title, content } });
            router.push("/");
        } catch (err: any) {
            setErrors(err.graphQLErrors.map((error: any) => error.message));
            console.error("Error creating entry:", err);
        } finally {
            setLoading(false); // Reset loading state after submission completes
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto">
            <h1 className="text-lg font-bold mb-4">Create Entry</h1>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full my-2 p-2 border"
            />
            <textarea
                name="content"
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="block w-full my-2 p-2 border"
            />
            {errors.length > 0 && (
                <div>
                    {errors.map((error) => (
                        <p key={error} className="text-red-500">
                            {error}
                        </p>
                    ))}
                </div>
            )}
            <button
                type="submit"
                className={`p-2 text-white ${loading ? "bg-gray-400" : "bg-green-500"}`}
                disabled={loading} // Disable button while loading
            >
                {loading ? "Loading..." : "Add Entry"}
            </button>
            <button
                type="button"
                onClick={() => router.push("/")}
                className="p-2 bg-gray-500 text-white ml-2"
            >
                Cancel
            </button>
        </form>
    );
};

export default AddEntry;
