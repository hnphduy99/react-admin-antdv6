export const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50 pointer-events-auto">
        <div className="dashed-loading" />
      </div>
    </div>
  );
};
