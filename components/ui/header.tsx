import { Button } from "@/components/ui/button";

const Header = () => {
    return (
      <header className="flex justify-between items-center p-6 border-b">
        <h1 className="text-xl font-semibold">Welcome, Chris</h1>
        <Button 
        size="icon" 
        variant="purple" // Add this variant to Button.tsx
      >
        C
      </Button>
      </header>
    );
  };
  
  export default Header;
  