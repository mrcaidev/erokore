import { UserMenu } from "@/components/user-menu";

const HomePage = () => {
  return (
    <main>
      <div className="fixed top-6 right-8">
        <UserMenu />
      </div>
    </main>
  );
};

export default HomePage;
