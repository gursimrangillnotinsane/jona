"use client";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const GET_ENTRY = gql`
  query ($id: Int!) {
    entry(id: $id) {
      id
      title
      content
    }
  }
`;

const EDIT_ENTRY = gql`
  mutation ($editEntryId: Int!, $title: String!, $content: String!) {
    editEntry(id: $editEntryId, title: $title, content: $content) {
      id
      title
      content
    }
  }
`;

const DELETE_ENTRY = gql`
  mutation ($deleteEntryId: Int!) {
    deleteEntry(id: $deleteEntryId) {
      id
    }
  }
`;

const Edit = ({ id }: { id: string }) => {
    const router = useRouter();
    const { loading, error, data } = useQuery(GET_ENTRY, {
        variables: { id: parseInt(id as string, 10) },
    });
    const [editEntryMutation] = useMutation(EDIT_ENTRY);
    const [deleteEntryMutation] = useMutation(DELETE_ENTRY);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    // Prefill form with entry data
    if (!title && !content) {
        setTitle(data.entry.title);
        setContent(data.entry.content);
    }

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await editEntryMutation({
                variables: { editEntryId: parseInt(id as string, 10), title, content },
            });
            router.push("/");
        } catch (err) {
            console.error("Error updating entry:", err);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteEntryMutation({
                variables: { deleteEntryId: parseInt(id as string, 10) },
            });
            router.push("/");
        } catch (err) {
            console.error("Error deleting entry:", err);
        }
    };

    return (
        <form onSubmit={handleEditSubmit} className="p-6 max-w-md mx-auto">
            <h1>Edit Entry</h1>
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
            <button type="submit" className="p-2 bg-blue-500 text-white">
                Save Changes
            </button>
            <button
                type="button"
                onClick={handleDelete}
                className="p-2 bg-red-500 text-white ml-2"
            >
                Delete Entry
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

export default Edit;
