"use client";
import { useQuery, gql, ApolloClient, InMemoryCache } from "@apollo/client";
import { useRouter } from "next/navigation";
import { UserButton } from "@stackframe/stack";
import { MDXRemote } from 'next-mdx-remote/rsc'
import MDXRendering from "../components/mdxRenderig"; // Import the MDXRendering component

export const ENTRIES_QUERY = gql`
  query {
    entries {
      id
      title
      content
      from
      to
    }
  }
`;

let refreshEntries: () => void;

const MainComponent = () => {
  const { loading, error, data, refetch } = useQuery(ENTRIES_QUERY);
  const router = useRouter();

  // Expose refetch as refreshEntries
  refreshEntries = refetch;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleEdit = (id: number) => {
    router.push(`/edit/${id}`);
  };

  return (
    <section>
      <div className="flex justify-end gap-8 p-6">
        <button onClick={() => router.push("/create")}>Add Entry</button>
        <UserButton />
      </div>
      <div className="flex flex-col items-center">
        {data.entries.map((entry: any) => (
          <div key={entry.id} className="border p-4 my-4 mx-auto w-2/3">
            <h2>{entry.title}</h2>
            <MDXRendering content={entry.content} />
            {/* <MDXRemote source={entry.content} /> */}
            <p>from - {entry.from}</p>
            <p>to - {entry.to}</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => handleEdit(entry.id)}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Export the refreshEntries function
export const refresh = () => {
  if (refreshEntries) {
    refreshEntries();
  }
};

export default MainComponent;
