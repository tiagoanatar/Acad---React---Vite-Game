import { useEffect } from 'react';

export const Main = () => {

  // Prevent page refresh with the G5 by mistake
  // useEffect(() => {
  //   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //     event.preventDefault();
  //     event.returnValue = ''; // This line is necessary for Chrome compatibility
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  return (
    <>
      <div>Hello</div>
    </>
  );
};
