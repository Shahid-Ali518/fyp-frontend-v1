import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// Removed the duplicate 'User' import here
import { Menu, X, Brain, User, LogOut, Settings, LayoutDashboard, ChevronRight, ShieldCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { AuthService } from "@/services/AuthApiService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Assessments", href: "/assessments" }
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [userName, setUserName] = useState(localStorage.getItem("username") || "User");

  // Sync auth state on route changes
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    setUserRole(localStorage.getItem("role"));
    setUserName(localStorage.getItem("username") || "User");
  }, [location]);

  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    setOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="section-padding flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl text-foreground">MindfulAI</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Link to="/login">
                <Button variant="outline-hero">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="coral">Get Started</Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-primary/20 p-0 overflow-hidden">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">{userRole?.toLowerCase()}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Role-Based Logic */}
                {userRole === "ADMIN" && (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/admin/users")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Manage Users</span>
                    </DropdownMenuItem>
                  </>
                )}

                {userRole === "USER" && (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard (History)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Edit Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </>
                )}

                {/* If no role is found (Edge Case), show a generic Profile option or nothing */}

                {!userRole && (

                  <DropdownMenuItem onClick={() => navigate("/not-found")}>

                    <User className="mr-2 h-4 w-4" />

                    <span>Profile</span>

                  </DropdownMenuItem>

                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile toggle button (Now outside the isLoggedIn logic) */}
          <button
            className="md:hidden text-foreground p-2 ml-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <nav className="flex flex-col gap-2 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={closeMenu}
                  className={`flex items-center justify-between py-2 text-base font-medium ${
                    location.pathname === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              ))}

              <div className="pt-4 mt-2 border-t border-border">
                {!isLoggedIn ? (
                  <div className="flex flex-col gap-3">
                    <Link to="/login" onClick={closeMenu}>
                      <Button className="w-full" variant="outline-hero">Sign In</Button>
                    </Link>
                    <Link to="/signup" onClick={closeMenu}>
                      <Button className="w-full" variant="coral">Get Started</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Account</p>

                    {userRole === "ADMIN" ? (
                      <>
                        <Button variant="ghost" className="justify-start px-0" onClick={() => { navigate("/admin/dashboard"); closeMenu(); }}>
                          <ShieldCheck className="mr-3 h-5 w-5" /> Admin Dashboard
                        </Button>
                        <Button variant="ghost" className="justify-start px-0" onClick={() => { navigate("/admin/users"); closeMenu(); }}>
                          <User className="mr-3 h-5 w-5" /> Manage Users
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" className="justify-start px-0" onClick={() => { navigate("/dashboard"); closeMenu(); }}>
                          <LayoutDashboard className="mr-3 h-5 w-5" /> Dashboard
                        </Button>
                        <Button variant="ghost" className="justify-start px-0" onClick={() => { navigate("/profile"); closeMenu(); }}>
                          <User className="mr-3 h-5 w-5" /> Edit Profile
                        </Button>
                      </>
                    )}

                    <Button
                      variant="ghost"
                      className="justify-start px-0 text-destructive hover:text-destructive mt-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-3 h-5 w-5" /> Logout
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;