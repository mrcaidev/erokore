const CollectionForbidden = () => {
  return (
    <main className="grid place-items-center h-screen">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">作品集不可见 🔒</h1>
        <p className="text-muted-foreground">没有权限查看这个作品集哦</p>
      </div>
    </main>
  );
};

export default CollectionForbidden;
