import { Routes, Route } from "react-router-dom";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { ChatProvider } from "./contexts/ChatContext";
import { AuthProvider } from "./contexts/AuthContext";
import { PostsProvider } from "./contexts/PostsContext";
import { FollowingProvider } from "./contexts/FollowingContext";
import { LikesProvider } from "./contexts/LikesContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { ReviewsProvider } from "./contexts/ReviewsContext";
import { QuestionsProvider } from "./contexts/QuestionsContext";
import { OrdersProvider } from "./contexts/OrdersContext";
import { FeedPage } from "./pages/FeedPage";
import { FollowingPage } from "./pages/FollowingPage";
import { MessagesPage } from "./pages/MessagesPage";
import { UploadPage } from "./pages/UploadPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { InterestsPage } from "./pages/InterestsPage";
import { WelcomePage } from "./pages/WelcomePage";
import { AccountPage } from "./pages/AccountPage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <ChatProvider>
          <ComparisonProvider>
            <CartProvider>
              <WishlistProvider>
                <PostsProvider>
                  <LikesProvider>
                    <FollowingProvider>
                      <ReviewsProvider>
                        <QuestionsProvider>
                          <OrdersProvider>
                            <Routes>
                              <Route path="/" element={<FeedPage />} />
                              <Route path="/following" element={<FollowingPage />} />
                              <Route path="/messages" element={<MessagesPage />} />
                              <Route path="/upload" element={<UploadPage />} />
                              <Route path="/account" element={<AccountPage />} />
                              <Route path="/settings" element={<SettingsPage />} />
                              <Route path="/login" element={<LoginPage />} />
                              <Route path="/signup" element={<SignupPage />} />
                              <Route path="/interests" element={<InterestsPage />} />
                              <Route path="/welcome" element={<WelcomePage />} />
                            </Routes>
                          </OrdersProvider>
                        </QuestionsProvider>
                      </ReviewsProvider>
                    </FollowingProvider>
                  </LikesProvider>
                </PostsProvider>
              </WishlistProvider>
            </CartProvider>
          </ComparisonProvider>
        </ChatProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}
