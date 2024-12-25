"use client";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { refresh } from "./mainComponent";
import '@mdxeditor/editor/style.css';
import { useUser } from "@stackframe/stack"
import {
    MDXEditor,
    UndoRedo,
    BoldItalicUnderlineToggles,
    toolbarPlugin,
    MDXEditorMethods,
    headingsPlugin,
    listsPlugin,
    ListsToggle,
    thematicBreakPlugin,
    InsertThematicBreak,
    CreateLink,
    linkDialogPlugin,
    linkPlugin,
    ChangeAdmonitionType,
    BlockTypeSelect,

} from '@mdxeditor/editor';
import React from "react";

const GET_ENTRY = gql`
  query ($id: Int!) {
    entry(id: $id) {
      id
      title
      content
      from 
      to
    }
  }
`;

const EDIT_ENTRY = gql`
  mutation ($editEntryId: Int!, $title: String!, $content: String!, $from: String!, $to: String!, $user: String!) {
    editEntry(id: $editEntryId, title: $title, content: $content, from: $from, to: $to, user: $user) {
      id
      title
      content
      from
      to
      user
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
    const ref = React.useRef<MDXEditorMethods>(null);
    const router = useRouter();
    const { loading, error, data } = useQuery(GET_ENTRY, {
        variables: { id: parseInt(id as string, 10) },
    });
    const [editEntryMutation] = useMutation(EDIT_ENTRY);
    const [deleteEntryMutation] = useMutation(DELETE_ENTRY);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const logUser = useUser({ or: "redirect" });
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    // Prefill form with entry data
    if (!title && !content) {
        setTitle(data.entry.title);
        setContent(data.entry.content);
        setFrom(data.entry.from);
        setTo(data.entry.to);
    }

    const handleEditSubmit = async () => {
        try {
            const user = logUser.id;
            await editEntryMutation({
                variables: { editEntryId: parseInt(id as string, 10), title, content, from, to, user },
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
            refresh();
            router.push("/");
        } catch (err) {
            console.error("Error deleting entry:", err);
        }
    };

    return (
        <>
            <div className="w-2/3 mx-auto p-6">
                <MDXEditor
                    markdown={data.entry.title}
                    onChange={(e) => setTitle(e)}
                    plugins={[headingsPlugin()]}
                />
                <MDXEditor
                    markdown={data.entry.from}
                    onChange={(e) => setFrom(e)}
                />
                <MDXEditor
                    markdown={data.entry.to}
                    onChange={(e) => setTo(e)}
                />
                <MDXEditor
                    markdown={data.entry.content}
                    ref={ref}
                    onChange={(e) => setContent(e)}
                    plugins={[
                        listsPlugin(),
                        thematicBreakPlugin(),
                        linkPlugin(),
                        linkDialogPlugin(),
                        headingsPlugin(),
                        toolbarPlugin({
                            toolbarClassName: 'my-classname',
                            toolbarContents: () => (
                                <>
                                    {''}
                                    <UndoRedo />
                                    <BoldItalicUnderlineToggles />
                                    <ListsToggle />
                                    <InsertThematicBreak />
                                    <CreateLink />
                                    <BlockTypeSelect />
                                </>
                            ),
                        }),
                    ]}
                />
                <button onClick={() => handleEditSubmit()}>Save Changes</button>
                <button onClick={() => handleDelete()}>Delete Entry</button>
            </div>
        </>

    );
};

export default Edit;
