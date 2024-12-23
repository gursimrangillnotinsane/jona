"use client";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useState } from "react";

const ENTRIES_QUERY = gql`
  query {
    entries {
      content
      date
      id
      title
    }
  }
`;

const DELETE_ENTRY = gql`
  mutation ($deleteEntryId: Int!) {
    deleteEntry(id: $deleteEntryId) {
      id
      title
      date
      content
    }
  }
`;

const CREATE_ENTRY = gql`
  mutation ($title: String!, $content: String!) {
    createEntry(title: $title, content: $content) {
      id
      title
      date
      content
    }
  }
`;

const EDIT_ENTRY = gql`
  mutation ($editEntryId: Int!, $title: String!, $content: String!) {
    editEntry(id: $editEntryId, title: $title, content: $content) {
      id
      title
      date
      content
    }
  }
`;

const MainComponent = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const { loading, error, data, refetch } = useQuery(ENTRIES_QUERY);
  const [deleteEntryMutation] = useMutation(DELETE_ENTRY);
  const [createEntryMutation] = useMutation(CREATE_ENTRY);
  const [editEntryMutation] = useMutation(EDIT_ENTRY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleDelete = async (id: number) => {
    try {
      await deleteEntryMutation({ variables: { deleteEntryId: id } });
      refetch();
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId !== null) {
        // Edit mode
        await editEntryMutation({
          variables: { editEntryId: editId, title, content },
        });
        setEditId(null); // Reset edit state
      } else {
        // Create mode
        await createEntryMutation({ variables: { title, content } });
      }
      setTitle("");
      setContent("");
      refetch();
    } catch (err) {
      console.error("Error submitting entry:", err);
    }
  };

  const handleEdit = (id: number, title: string, content: string) => {
    setEditId(id);
    setTitle(title);
    setContent(content);
  };

  return (
    <section>
      {data.entries.map((entry: any) => (
        <div key={entry.id}>
          <br />
          <br />
          <h2>{entry.title}</h2>
          <p>{entry.content}</p>
          <p>{entry.date}</p>
          <button onClick={() => handleDelete(parseInt(entry.id))}>Delete</button>
          <button onClick={() => handleEdit(parseInt(entry.id), entry.title, entry.content)}>Edit</button>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          name="content"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">{editId !== null ? "Edit Entry" : "Add Entry"}</button>
      </form>
    </section>
  );
};

export default MainComponent;
