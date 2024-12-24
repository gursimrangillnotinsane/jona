"use client";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { UserButton } from "@stackframe/stack";

const ENTRIES_QUERY = gql`
  query {
    entries {
      id
      title
      date
      content
    }
  }
`;

const MainComponent = () => {
  const { loading, error, data } = useQuery(ENTRIES_QUERY);
  const router = useRouter();

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
            <p>{entry.content}</p>
            <p>{entry.date}</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => handleEdit(entry.id)}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MainComponent;
