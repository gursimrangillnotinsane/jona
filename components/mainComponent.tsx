"use client";
import { useQuery, gql, ApolloClient, InMemoryCache } from "@apollo/client";
import { useRouter } from "next/navigation";
import { UserButton } from "@stackframe/stack";
import MDXRendering from "../components/mdxRenderig"; // Import the MDXRendering component
import { useUser } from "@stackframe/stack"
import React, { useState } from "react";
import PathDrawing from "./motionHeart";
import LoadingApp from "./loading";
export const ENTRIES_QUERY = gql`
  query {
    entries {
      id
      title
      content
      from
      to
      user
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
  if (error) return <p>Error: {error.message}</p>;

  const handleEdit = (id: number) => {
    router.push(`/edit/${id}`);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };


  return (
    <>

      <div className="w-1/4 fixed left-0">
        <PathDrawing color={"#ff0088"} />
      </div>
      <div className='w-1/4 fixed right-5 top-1/3 transform rotate-45 z-10'>
        <PathDrawing color={"#000"} />
      </div>
      <section>
        <div className="flex justify-end gap-8 p-6 fixed w-full">
          <button onClick={() => router.push("/create")}>Add Entry</button>
          <UserButton />
        </div>
        <div className="flex flex-col items-center">
          {data.entries.map((entry: any) => (
            <div key={entry.id} className={`card border p-4 my-4 w-2/3 ${isExpanded ? "expanded" : ""}`}>

              <h2>{entry.title}</h2>

              <div className="border-x-0 border-y-2 border-white  flex items-end flex-col p-2 mb-5" >
                <p>from - {entry.from}</p>
                <p>to - {entry.to}</p>
              </div>

              <MDXRendering content={entry.content} />
              <button className="absolute left-[45%] bottom-3" onClick={toggleExpand}>
                {isExpanded ? "View Less" : "View More"}
              </button>
              {user.id == entry.user &&
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
