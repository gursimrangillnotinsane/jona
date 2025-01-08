"use client";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { UserButton } from "@stackframe/stack";
import MDXRendering from "../components/mdxRenderig"; // Import the MDXRendering component
import { useUser } from "@stackframe/stack"
import React, { useState } from "react";
import PathDrawing from "./motionHeart";
import LoadingApp from "./loading";

interface Entry {
  id: number;
  title: string;
  content: string;
  from: string;
  to: string;
  user: string;
  date: string;
}
export const ENTRIES_QUERY = gql`
  query {
    entries {
      id
      title
      content
      from
      to
      user
      date
    }
  }
`;

let refreshEntries: () => void;

const MainComponent = () => {
  const { loading, error, data, refetch } = useQuery(ENTRIES_QUERY);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const user = useUser();

  // Expose refetch as refreshEntries
  refreshEntries = refetch;

  if (loading) return (
    <LoadingApp />
  );
  if (error) return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>Something Went Wrong, Sign Out and Try Again</h1>
        <button onClick={() => user && user.signOut()}>Sign Out</button>
      </div>
    </>
  )

  const handleEdit = (id: number) => {
    router.push(`/edit/${id}`);
  };

  const toggleExpand = () => {
    console.log("toggling");
    setIsExpanded(!isExpanded);
  };


  return (
    <>

      <div className="w-1/4 fixed left-0 top-12">
        <PathDrawing color={"#ff0088"} />
      </div>
      <div className='w-1/4 fixed right-5 top-1/3 transform rotate-45 z-10'>
        <PathDrawing color={"#000"} />
      </div>
      <section className="flex flex-col items-center ">
        <div className="flex  justify-end gap-8 p-4   w-full sticky top-0 z-[60] header">
          <h3 >I love you so</h3>
          <button onClick={() => router.push("/create")}>Add Entry</button>
          <UserButton />
        </div>
        <div className="flex flex-col items-center pb-10">
          {data.entries.map((entry: Entry) => (
            <div key={entry.id} className={`card border p-4 my-4 lg:w-2/3 w-3/4 ${isExpanded ? "expanded" : ""}`}>

              <h2>{entry.title}</h2>

              <div className="border-x-0 border-y-2 border-white  flex flex-col p-2 mb-5" >
                <p>from - <strong>{entry.from}</strong></p>
                <p>to - <strong>{entry.to}</strong> </p>
              </div>
              <p>{entry.date}</p>
              <MDXRendering content={entry.content} />
              <button
                className={`mt-4 py-2 px-4 text-sm font-bold rounded border lg:text-base lg:px-6 absolute bottom-0 right-4 z-[99]`}
                onClick={toggleExpand}
              >
                {isExpanded ? "View Less" : "View More"}
              </button>
              {user && user.id == entry.user &&
                <div className="flex justify-start gap-4 z-50">
                  <button onClick={() => handleEdit(entry.id)}>Edit</button>

                </div>}
            </div>

          ))}
        </div>
      </section>
    </>
  );
};

// Export the refreshEntries function
export const refresh = () => {
  if (refreshEntries) {
    refreshEntries();
  }
};

export default MainComponent;
