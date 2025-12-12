import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  LogOut,
  KeyRound,
  X,
  CheckCircle,
  Heart,
  ChevronRight,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { changePassword, logoutUser } from "../apis/api";
import { setLogout } from "../store/authSlice";
import toast from "react-hot-toast";
import { getFavorites, removeFavorite } from "../utils/favorites";

// --- Animation Variants ---
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function ProfilePage() {
  // --- Logic State ---
  const [favoriteProducts, setFavoriteProducts] = useState(getFavorites());
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Optimization: Memoize current user to prevent unstable object references
  const currentUser = useMemo(() => user || {}, [user]);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Effects ---
  useEffect(() => {
    const syncFavorites = () => setFavoriteProducts(getFavorites());
    window.addEventListener("storage", syncFavorites);
    window.addEventListener("favoritesUpdated", syncFavorites);
    return () => {
      window.removeEventListener("storage", syncFavorites);
      window.removeEventListener("favoritesUpdated", syncFavorites);
    };
  }, []);

  // --- Handlers (Optimized with useCallback) ---

  const handleLogout = useCallback(async () => {
    const response = await logoutUser();
    if (response.success) {
      dispatch(setLogout());
      window.location.reload();
      navigate("/");
    }
  }, [dispatch, navigate]);

  const handleChangePassword = useCallback(
    async (e) => {
      e.preventDefault();
      if (newPassword !== confirmPassword)
        return toast.error("Passwords do not match!");
      if (newPassword.length < 6)
        return toast.error("Password must be at least 6 characters");

      setLoading(true);
      try {

        const res = await changePassword({ newPassword, confirmPassword });
        if (res.success) {
          toast.success("Password changed successfully!");
        } else {
          toast.error(res.message || "Failed to change password");
        }

        setShowPasswordModal(false);
        setNewPassword("");
        setConfirmPassword("");
      } catch (err) {
        toast.error("Failed to change password");
      } finally {
        setLoading(false);
      }
    },
    [newPassword, confirmPassword]
  );

  const removeFromFavorites = useCallback((productId) => {
    removeFavorite(productId);
    setFavoriteProducts(getFavorites());
    toast.success("Removed from favorites");
    window.dispatchEvent(new Event("favoritesUpdated"));
  }, []);

  const openPasswordModal = useCallback(() => setShowPasswordModal(true), []);
  const closePasswordModal = useCallback(() => setShowPasswordModal(false), []);
  const navigateToOrders = useCallback(
    () => navigate("/my-orders"),
    [navigate]
  );

  // --- Render ---
  return (
    <div className="min-h-screen  font-sans text-gray-800 selection:bg-green-100">
      {/* Mobile Header / Desktop Breadcrumb Area */}
      <div className="bg-transparent sticky top-22 z-30 backdrop-blur-xl ">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
            Profile Details
          </h1>
          <span className="text-xs sm:text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
            {currentUser.role || "Member"}
          </span>
        </div>
      </div>

      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:py-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* --- LEFT COLUMN: Identity & Navigation (Sticky on Desktop) --- */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Profile Identity Card */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative"
              >
                {/* NEW: Exact same height (h-24), but with rich farm SVG background */}
                <div className="h-24 relative overflow-hidden bg-green-50">
                  <svg
                    viewBox="0 0 1440 320"
                    className="absolute bottom-0 left-0 w-full h-auto"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Light sky background */}
                    <rect width="1440" height="320" fill="#f0fdf4" />

                    {/* Rolling green hills - farm land */}
                    <path
                      d="M0,180 C360,120 720,240 1440,160 L1440,320 L0,320 Z"
                      fill="#86efac"
                      opacity="0.8"
                    />
                    <path
                      d="M0,200 C400,140 700,220 1440,180 L1440,320 L0,320 Z"
                      fill="#22c55e"
                    />

                    {/* Wheat / Grass in foreground */}
                    <g fill="#84cc16" opacity="0.9">
                      {[150, 380, 620, 860, 1100].map((x) => (
                        <g key={x} transform={`translate(${x}, 160)`}>
                          <path
                            d="M10,0 L10,60"
                            stroke="#65a30d"
                            strokeWidth="3"
                            opacity="0.8"
                          />
                          <path
                            d="M0,15 Q10,5 20,15"
                            fill="none"
                            stroke="#84cc16"
                            strokeWidth="5"
                          />
                          <path
                            d="M0,35 Q10,25 20,35"
                            fill="none"
                            stroke="#84cc16"
                            strokeWidth="5"
                          />
                        </g>
                      ))}
                    </g>

                    {/* Floating farm icons (tomato, carrot, brinjal) */}
                    <g opacity="0.95">
                      <circle cx="280" cy="200" r="14" fill="#ef4444" />
                      <path
                        d="M280,188 Q275,182 280,182 Q285,182 280,188"
                        fill="#22c55e"
                      />

                      <path d="M580,210 L590,240 L570,240 Z" fill="#fb923c" />
                      <path
                        d="M580,210 L580,195"
                        stroke="#22c55e"
                        strokeWidth="3"
                      />

                      <ellipse
                        cx="980"
                        cy="215"
                        rx="12"
                        ry="18"
                        fill="#7c3aed"
                      />
                      <path
                        d="M980,197 L980,185"
                        stroke="#22c55e"
                        strokeWidth="3"
                      />
                    </g>

                    {/* Bottom grass layer */}
                    <path
                      d="M0,280 Q360,270 720,280 T1440,280 L1440,320 L0,320 Z"
                      fill="#16a34a"
                      opacity="0.7"
                    />
                  </svg>
                </div>
                <div className="px-5 pb-5">
                  <div className="relative -mt-12 mb-3">
                    <img
                      src={currentUser.profilePicture || "/default-avatar.png"}
                      alt={currentUser.fullName}
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">
                      {currentUser.fullName || "User Name"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Navigation Menu - iOS Style List for Mobile Optimization */}
              <motion.nav
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="divide-y divide-gray-50">
                  <MenuItem
                    icon={<Package className="w-5 h-5 text-blue-500" />}
                    label="My Orders"
                    onClick={navigateToOrders}
                  />
                  <MenuItem
                    icon={<KeyRound className="w-5 h-5 text-orange-500" />}
                    label="Change Password"
                    onClick={openPasswordModal}
                  />
                  <MenuItem
                    icon={<LogOut className="w-5 h-5 text-red-500" />}
                    label="Log Out"
                    onClick={handleLogout}
                    isDestructive
                  />
                </div>
              </motion.nav>

              {/* Compact Details for Desktop */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-sm"
              >
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Details
                </h3>
                <div className="space-y-4">
                  <DetailRow
                    icon={<Phone className="w-4 h-4" />}
                    label="Phone"
                    value={currentUser.phoneNumber || "N/A"}
                  />
                  <DetailRow
                    icon={<MapPin className="w-4 h-4" />}
                    label="Region"
                    value="Gujarat, India"
                  />
                  <DetailRow
                    icon={<Calendar className="w-4 h-4" />}
                    label="Joined"
                    value={new Date(
                      currentUser.joinedDate || Date.now()
                    ).toLocaleDateString()}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Content Area --- */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Favorites Section */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  Saved Items
                </h3>
                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                  {favoriteProducts.length} Items
                </span>
              </div>

              {favoriteProducts.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AnimatePresence>
                    {favoriteProducts.map((product) => (
                      <FavoriteItem
                        key={product._id}
                        product={product}
                        // Passing an inline function here is okay for the navigate part if we don't want to over-optimize,
                        // but best is to keep FavoriteItem memoized.
                        onClick={() => navigate(`/product/${product._id}`)}
                        onRemove={removeFromFavorites}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Modal Layer */}
      <AnimatePresence>
        {showPasswordModal && (
          <PasswordModal
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            setNewPassword={setNewPassword}
            setConfirmPassword={setConfirmPassword}
            onSubmit={handleChangePassword}
            onClose={closePasswordModal}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ------------------------------------------------------------------
// SUB-COMPONENTS (OPTIMIZED WITH MEMO)
// ------------------------------------------------------------------

const MenuItem = memo(({ icon, label, onClick, isDestructive = false }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group active:bg-gray-100 ${
      isDestructive ? "text-red-600 hover:bg-red-50" : "text-gray-700"
    }`}
  >
    <div className="flex items-center gap-3.5">
      <div
        className={`p-2 rounded-lg ${
          isDestructive
            ? "bg-red-100/50"
            : "bg-gray-100/80 group-hover:bg-white group-hover:shadow-sm transition-all"
        }`}
      >
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
  </button>
));

const DetailRow = memo(({ icon, label, value }) => (
  <div className="flex items-start gap-3 text-gray-600">
    <div className="mt-0.5 text-gray-400">{icon}</div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  </div>
));

const FavoriteItem = memo(({ product, onClick, onRemove }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    onClick={onClick}
    className="group bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 hover:border-green-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
  >
    <div className="w-16 h-16 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
      <img
        src={product.photos?.[0] || ""}
        alt={product.name}
        className="w-full h-full object-cover"
        onError={(e) =>
          (e.currentTarget.src = "https://via.placeholder.com/100?text=N/A")
        }
      />
    </div>

    <div className="flex-1 min-w-0 py-1">
      <h4 className="text-sm font-semibold text-gray-900 truncate pr-6">
        {product.name}
      </h4>
      <p className="text-xs text-gray-500 mt-0.5">{product.unit}</p>
      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-sm font-bold text-green-700">
          ₹{Number(product.pricePerUnit).toFixed(0)}
        </span>
      </div>
    </div>

    <button
      onClick={(e) => {
        e.stopPropagation();
        onRemove(product._id);
      }}
      className="absolute top-2 right-2 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
      title="Remove"
    >
      <Heart className="w-4 h-4 fill-current" />
    </button>
  </motion.div>
));

const EmptyState = memo(() => (
  <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
      <Package className="w-8 h-8 text-gray-300" />
    </div>
    <p className="text-gray-900 font-medium">No favorites yet</p>
    <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
      Items you save will appear here for quick access.
    </p>
  </div>
));

const PasswordModal = memo(
  ({
    newPassword,
    confirmPassword,
    setNewPassword,
    setConfirmPassword,
    onSubmit,
    onClose,
    loading,
  }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Security</h3>
            <p className="text-xs text-gray-500">Update your password</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white rounded-full hover:bg-gray-100 border border-gray-100 transition"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 ml-1 mb-1.5 block">
                New Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="Min 6 characters"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 ml-1 mb-1.5 block">
                Confirm Password
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="Re-type password"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 active:scale-[0.98] rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Save Changes</>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
);
