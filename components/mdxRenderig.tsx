
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { useEffect, useState } from "react";

interface MDXRenderingProps {
    content: string;
}

const MDXRendering = ({ content }: MDXRenderingProps) => {
    const [mdxContent, setMdxContent] = useState<MDXRemoteSerializeResult | null>(null);

    useEffect(() => {
        const loadMDX = async () => {
            const serialized = await serialize(content); // Serializing the MDX content
            setMdxContent(serialized);
        };
        loadMDX();
    }, [content]);

    if (!mdxContent) return <p>Loading...</p>;

    return <MDXRemote {...mdxContent} />; // Pass the serialized content to MDXRemote
};

export default MDXRendering;

