const useOrientation = () => {
  const [isLandscape, setIsLandscape] = useState(
    window.innerHeight < window.innerWidth
  );
  
  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.innerHeight < window.innerWidth);
    };
    
    window.addEventListener('resize', handleOrientationChange);
    return () => window.removeEventListener('resize', handleOrientationChange);
  }, []);
  
  return isLandscape;
};

export default useOrientation;
