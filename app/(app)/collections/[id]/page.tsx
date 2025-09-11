import { useParams } from "next/navigation";

const CollectionPage = () => {
  const { id } = useParams<{ id: string }>();

  return <div>作品集 {id}</div>;
};

export default CollectionPage;
