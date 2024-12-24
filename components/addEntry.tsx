import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { refresh } from "./mainComponent"; // Import the refresh function

const CREATE_ENTRY = gql`
  mutation ($title: String!, $content: String!, $from: String!, $to: String!) {
    createEntry(title: $title, content: $content, from: $from, to: $to) {
      id
      title
      content
      from
      to
    }
  }
`;

const AddEntry = () => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [createEntryMutation] = useMutation(CREATE_ENTRY);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createEntryMutation({ variables: { title, content, from, to } });
            refresh(); // Call the refresh function to reload data
            router.push("/");
        } catch (err: any) {
            console.error("Error creating entry:", err);
        } finally {
            setLoading(false);
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
            <input
                type="text"
                name="from"
                placeholder="from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="block w-full my-2 p-2 border"
            />
            <input
                type="text"
                name="to"
                placeholder="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="block w-full my-2 p-2 border"
            />
            <textarea
                name="content"
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="block w-full my-2 p-2 border"
            />
            <button
                type="submit"
                className={`p-2 text-white ${loading ? "bg-gray-400" : "bg-green-500"}`}
                disabled={loading}
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
