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
import './edit.css'
import toast, { Toaster } from 'react-hot-toast';
import LoadingApp from "./loading";

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
  mutation ($editEntryId: Int!, $title: String!, $content: String!, $from: String!, $to: String!) {
    editEntry(id: $editEntryId, title: $title, content: $content, from: $from, to: $to) {
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
    if (loading) return (
        <LoadingApp />
    );
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
            await toast.promise(
                editEntryMutation({ variables: { editEntryId: parseInt(id as string, 10), title, content, from, to } }),
                {
                    loading: "Editing your entry my love...",
                    success: "Entry saved successfully!",
                    error: "Failed to edit the entry. :( Please try again.",
                }
            );

            router.push("/");
        } catch (err) {
            console.error("Error updating entry:", err);
        }
    };

    const handleDelete = async () => {
        const userConfirmed = window.confirm("Are you sure you want to delete this entry?");
        if (!userConfirmed) {
            return; // If the user cancels, stop further execution
        }
        try {
            await toast.promise(
                deleteEntryMutation({
                    variables: { deleteEntryId: parseInt(id as string, 10) },
                }),
                {
                    loading: "Deleting your entry my love...",
                    success: "Entry deleted successfully!",
                    error: "Failed to delete the entry. :( Please try again.",
                }
            );
            refresh();
            router.push("/");
        } catch (err) {
            console.error("Error deleting entry:", err);
        }
    };

    return (
        <>
            <div className="mainEditDiv min-h-screen">
                <Toaster />

                <div className="lg:w-2/3 w-[85%] mx-auto flex flex-col justify-center gap-6 pb-4">
                    <h2>Editing cuz ur dumb</h2>
                    <div className="flex items-center">
                        <h3>Title - </h3>
                        <MDXEditor
                            markdown={data.entry.title}
                            onChange={(e) => setTitle(e)}
                            plugins={[headingsPlugin()]}
                        />
                    </div>
                    {/* <MDXEditor
                        markdown={data.entry.from}
                        onChange={(e) => setFrom(e)}
                    /> */}
                    <div className="flex items-center">
                        <h3>From - </h3>
                        <h4 className="uppercase ">{data.entry.from}</h4>
                    </div>
                    <div className="flex items-center">
                        <h3>To - </h3>

                        <MDXEditor
                            markdown={data.entry.to}
                            onChange={(e) => setTo(e)}
                        />
                    </div>
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
                    <div className="flex gap-4 w-full ml-4">
                        <button onClick={() => handleEditSubmit()}>Save Changes</button>
                        <button className="delete" onClick={() => handleDelete()}>Delete Entry</button>
                        <button onClick={() => router.push("/")}>Cancel</button>
                    </div>
                </div>
            </div>
        </>

    );
};

export default Edit;
