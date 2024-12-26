"use client";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { refresh } from "./mainComponent"; // Import the refresh function
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
import '@mdxeditor/editor/style.css';
import './toobar.css';
import toast, { Toaster } from 'react-hot-toast';



const CREATE_ENTRY = gql`
  mutation ($title: String!, $content: String!, $from: String!, $to: String!,$user:String!) {
    createEntry(title: $title, content: $content, from: $from, to: $to, user:$user) {
      id
      title
      content
      from
      to
      user
    }
  }
`;

const AddEntry = () => {
    const ref = React.useRef<MDXEditorMethods>(null);
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [createEntryMutation] = useMutation(CREATE_ENTRY);

    const loguser = useUser({ or: "redirect" });

    const handleSubmit = async () => {

        try {
            const user = loguser.id;
            console.log(user, title, content, from, to);

            await toast.promise(
                createEntryMutation({ variables: { title, content, from, to, user } }),
                {
                    loading: "Saving your entry my love...",
                    success: "Entry saved successfully!",
                    error: "Failed to save the entry. :( Please try again.",
                }
            );
            refresh(); // Call the refresh function to reload data
            router.push("/");
        } catch (err: any) {
            console.error("Error creating entry:", err);
        }
    };

    useEffect(() => {
        setTitle("HAPPY ANNIVERSARY");
        setFrom(loguser.displayName);
        setTo("TO MY LOVE");
        setContent("I LOVE YOU");

    }, []);

    return (
        <>
            <div className="mainDiv w-screen h-screen p-6">
                <Toaster />
                <div className="addCard w-[75%] mx-auto p-6 h-4/5 flex flex-col  justify-center">
                    <h2>Add ur love here</h2>
                    <div className='flex'>
                        <h3>Title - </h3>
                        <MDXEditor
                            markdown={" HAPPY ANNIVERSARY"}
                            onChange={(e) => setTitle(e)}
                            plugins={[headingsPlugin()]}
                        />
                    </div>

                    <div className='flex'>
                        <h3>From - </h3>
                        <MDXEditor
                            markdown={loguser.displayName}
                            onChange={(e) => setFrom(e)}
                        /></div>

                    <div className='flex'>
                        <h3>To - </h3>
                        <MDXEditor
                            markdown={"TO MY LOVE"}
                            onChange={(e) => setTo(e)}
                        /></div>

                    <div className='flex'>
                        <h3>Content - </h3>
                        <MDXEditor

                            markdown={"dummy just lick and chnage everything sigh"}
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
                                            {/* <ListsToggle /> */}
                                            <InsertThematicBreak />
                                            <CreateLink />
                                            <BlockTypeSelect />
                                        </>
                                    ),
                                }),
                            ]}
                        /></div>
                    <div className="flex gap-6">
                        <button onClick={() => handleSubmit()}>Save Changes</button>
                        <button onClick={() => router.push("/")}>Cancel</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddEntry;
