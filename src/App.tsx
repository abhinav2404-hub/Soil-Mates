import React, { useState, useEffect } from 'react';
import {
  ScreenId,
  UserRole,
  ProduceItem,
  CartItem,
  OrderItem,
  CropDiagnosis,
  SupportedLanguage,
  VendorReview,
  FarmerDispatchOrder
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_VENDOR_REVIEWS,
  INITIAL_FARMER_DISPATCHES,
  SAMPLE_DIAGNOSES
} from './data/agriData';
import { PhoneContainer } from './components/PhoneContainer';
import { BottomNav } from './components/BottomNav';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { FarmerHubScreen } from './components/FarmerHubScreen';
import { VendorHubScreen } from './components/VendorHubScreen';
import { AiDoctorScreen } from './components/AiDoctorScreen';
import { DiagnosisResultScreen } from './components/DiagnosisResultScreen';
import { MarketScreen } from './components/MarketScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { SellProduceScreen } from './components/SellProduceScreen';
import { CartScreen } from './components/CartScreen';
import { OrdersScreen } from './components/OrdersScreen';
import { TrackOrderScreen } from './components/TrackOrderScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { LanguageModal } from './components/LanguageModal';
import { VoiceQueryModal } from './components/VoiceQueryModal';
import { SupportModal } from './components/SupportModal';
import { ChatBotPanel } from './components/ChatBotPanel';
import { ProduceOriginModal } from './components/ProduceOriginModal';
import { CameraQRScannerModal } from './components/CameraQRScannerModal';
import { VendorReviewsModal } from './components/VendorReviewsModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { DocsViewerModal } from './components/DocsViewerModal';
import { YieldPredictionModal } from './components/YieldPredictionModal';
import { FarmerMaterialListerModal } from './components/FarmerMaterialListerModal';
import { Toast } from './components/Toast';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('s-splash');
  const [userRole, setUserRole] = useState<UserRole>('farmer');
  const [products, setProducts] = useState<ProduceItem[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<ProduceItem>(INITIAL_PRODUCTS[0]);
  const [cart, setCart] = useState<CartItem[]>([
    { produce: INITIAL_PRODUCTS[0], quantity: 2 }, // 2kg Tomatoes
    { produce: INITIAL_PRODUCTS[1], quantity: 3 }, // 3 bunches Palak
    { produce: INITIAL_PRODUCTS[3], quantity: 1 }  // 1kg Onions
  ]);
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem>(INITIAL_ORDERS[0]);
  const [farmerDispatches, setFarmerDispatches] = useState<FarmerDispatchOrder[]>(INITIAL_FARMER_DISPATCHES);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<CropDiagnosis>(SAMPLE_DIAGNOSES[0]);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('Hindi');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('soilMatesDarkMode') === '1';
  });

  // Modals & Chat state
  const [reviews, setReviews] = useState<VendorReview[]>(INITIAL_VENDOR_REVIEWS);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState<boolean>(false);
  const [isVendorReviewsOpen, setIsVendorReviewsOpen] = useState<boolean>(false);
  const [vendorReviewProduct, setVendorReviewProduct] = useState<ProduceItem | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [voiceContext, setVoiceContext] = useState<string>('crop');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);
  const [isOriginModalOpen, setIsOriginModalOpen] = useState<boolean>(false);
  const [originProduce, setOriginProduce] = useState<ProduceItem | null>(null);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState<boolean>(false);
  const [isYieldCalculatorOpen, setIsYieldCalculatorOpen] = useState<boolean>(false);
  const [isMaterialListerOpen, setIsMaterialListerOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [activeFarmerChat, setActiveFarmerChat] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dark mode class
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('soilMatesDarkMode', isDarkMode ? '1' : '0');
  }, [isDarkMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const handleNavigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
    setIsChatOpen(false);
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === 'vendor') {
      setCurrentScreen('s-vendor');
      showToast('Vendor Hub activated.');
    } else if (role === 'farmer') {
      setCurrentScreen('s-farmer');
      showToast('Welcome back, Farmer Ramesh Patel! Farmgate Logistics Hub active.');
    } else {
      setCurrentScreen('s-home');
      showToast('Welcome back, Priya!');
    }
  };

  const handleAddToCart = (item: ProduceItem, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.produce.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.produce.id === item.id ? { ...c, quantity: c.quantity + quantity } : c
        );
      }
      return [...prev, { produce: item, quantity }];
    });
    showToast(`Added ${quantity} ${item.unit} ${item.name} to Cart`);
  };

  const handleUpdateCartQuantity = (produceId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.produce.id === produceId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (produceId: string) => {
    setCart((prev) => prev.filter((item) => item.produce.id !== produceId));
    showToast('Item removed from cart.');
  };

  const handlePlaceOrder = (newOrder: OrderItem) => {
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrder(newOrder);
    setCart([]);
  };

  const handleAddProduct = (newProduct: ProduceItem) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleApplyYieldToListing = (cropName: string, quantityKg: number, pricePerKg: number) => {
    setCurrentScreen('s-sell');
    showToast(`🌾 Pre-filled listing: ${quantityKg.toLocaleString('en-IN')}kg ${cropName} @ ₹${pricePerKg}/kg!`);
  };

  const handleOpenFarmerChat = (farmName: string) => {
    setActiveFarmerChat(farmName);
    setIsChatOpen(true);
  };

  const handleStartVoice = (ctx: string) => {
    setVoiceContext(ctx);
    setIsVoiceModalOpen(true);
  };

  const handleOpenOriginModal = (produceId?: string) => {
    if (produceId) {
      const found = products.find((p) => p.id === produceId);
      if (found) {
        setOriginProduce(found);
      }
    } else {
      setOriginProduce(selectedProduct);
    }
    setIsOriginModalOpen(true);
  };

  const handleAddReview = (newReviewData: Omit<VendorReview, 'id' | 'date' | 'helpfulCount'>) => {
    const newReview: VendorReview = {
      ...newReviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      helpfulCount: 0
    };
    setReviews((prev) => [newReview, ...prev]);

    // Recalculate average rating & reviewsCount for that produce
    setProducts((prev) =>
      prev.map((item) => {
        if (
          item.id === newReview.produceId ||
          item.farmName.toLowerCase() === newReview.farmerName.toLowerCase()
        ) {
          const matchingReviews = [
            newReview,
            ...reviews.filter(
              (r) =>
                r.produceId === item.id ||
                r.farmerName.toLowerCase() === item.farmName.toLowerCase()
            )
          ];
          const newAvg = Number(
            (
              matchingReviews.reduce((sum, r) => sum + r.rating, 0) /
              matchingReviews.length
            ).toFixed(1)
          );
          return {
            ...item,
            rating: newAvg,
            reviewsCount: matchingReviews.length
          };
        }
        return item;
      })
    );

    // Also update selectedProduct
    setSelectedProduct((prev) => {
      if (
        prev.id === newReview.produceId ||
        prev.farmName.toLowerCase() === newReview.farmerName.toLowerCase()
      ) {
        const matchingReviews = [
          newReview,
          ...reviews.filter(
            (r) =>
              r.produceId === prev.id ||
              r.farmerName.toLowerCase() === prev.farmName.toLowerCase()
          )
        ];
        const newAvg = Number(
          (
            matchingReviews.reduce((sum, r) => sum + r.rating, 0) /
            matchingReviews.length
          ).toFixed(1)
        );
        return {
          ...prev,
          rating: newAvg,
          reviewsCount: matchingReviews.length
        };
      }
      return prev;
    });

    showToast(`⭐ Review posted for ${newReview.farmerName}!`);
  };

  const handleHelpfulClick = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    showToast('Marked review as helpful 👍');
  };

  const handleOpenVendorReviews = (product: ProduceItem) => {
    setVendorReviewProduct(product);
    setIsVendorReviewsOpen(true);
  };

  const handleScanQRSuccess = (produceId: string) => {
    const found = products.find((p) => p.id === produceId) || products[0];
    setOriginProduce(found);
    setIsOriginModalOpen(true);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <PhoneContainer onOpenInstallModal={() => setIsInstallModalOpen(true)}>
      {/* Dynamic Screen Routing */}
      <div className="relative flex-1 flex flex-col overflow-hidden">
        {currentScreen === 's-splash' && (
          <SplashScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 's-login' && (
          <LoginScreen
            userRole={userRole}
            onSetRole={setUserRole}
            onLogin={handleLogin}
            onOpenLanguage={() => setIsLanguageModalOpen(true)}
            onStartVoice={handleStartVoice}
            currentLanguage={currentLanguage}
            onAddProduct={handleAddProduct}
            onShowToast={showToast}
            products={products}
          />
        )}

        {currentScreen === 's-home' && (
          <HomeScreen
            products={products}
            cartCount={totalCartCount}
            onNavigate={handleNavigate}
            onSelectProduct={setSelectedProduct}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onOpenOriginModal={handleOpenOriginModal}
            onOpenQRScanner={() => setIsQRScannerOpen(true)}
            onOpenVendorReviews={handleOpenVendorReviews}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
          />
        )}

        {currentScreen === 's-farmer' && (
          <FarmerHubScreen
            dispatches={farmerDispatches}
            onUpdateDispatches={setFarmerDispatches}
            products={products}
            onNavigate={handleNavigate}
            onShowToast={showToast}
            onOpenQRScanner={() => setIsQRScannerOpen(true)}
            onOpenOriginModal={handleOpenOriginModal}
            onOpenYieldCalculator={() => setIsYieldCalculatorOpen(true)}
            onOpenMaterialLister={() => setIsMaterialListerOpen(true)}
          />
        )}

        {currentScreen === 's-vendor' && (
          <VendorHubScreen
            onNavigate={handleNavigate}
            onOpenSupport={() => setIsSupportModalOpen(true)}
            onStartVoice={handleStartVoice}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {currentScreen === 's-ai' && (
          <AiDoctorScreen
            onNavigate={handleNavigate}
            onSetDiagnosis={setCurrentDiagnosis}
            onStartVoice={handleStartVoice}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 's-result' && (
          <DiagnosisResultScreen
            diagnosis={currentDiagnosis}
            onNavigate={handleNavigate}
            onAddToCart={(medicine) => handleAddToCart(medicine, 1)}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 's-market' && (
          <MarketScreen
            onNavigate={handleNavigate}
            onShowToast={showToast}
            onOpenOriginModal={handleOpenOriginModal}
            onOpenQRScanner={() => setIsQRScannerOpen(true)}
          />
        )}

        {currentScreen === 's-buy' && (
          <ProductDetailScreen
            product={selectedProduct}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onOpenFarmerChat={handleOpenFarmerChat}
            onOpenOriginModal={handleOpenOriginModal}
            onOpenQRScanner={() => setIsQRScannerOpen(true)}
            onOpenVendorReviews={handleOpenVendorReviews}
            reviews={reviews}
            onAddReview={handleAddReview}
            onHelpfulClick={handleHelpfulClick}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 's-sell' && (
          <SellProduceScreen
            onNavigate={handleNavigate}
            onAddProduct={handleAddProduct}
            onShowToast={showToast}
            onOpenYieldCalculator={() => setIsYieldCalculatorOpen(true)}
          />
        )}

        {currentScreen === 's-cart' && (
          <CartScreen
            cart={cart}
            onNavigate={handleNavigate}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onPlaceOrder={handlePlaceOrder}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 's-orders' && (
          <OrdersScreen
            orders={orders}
            onNavigate={handleNavigate}
            onSelectOrder={setSelectedOrder}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 's-track' && (
          <TrackOrderScreen
            order={selectedOrder}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 's-profile' && (
          <ProfileScreen
            userRole={userRole}
            isDarkMode={isDarkMode}
            currentLanguage={currentLanguage}
            onToggleDarkMode={() => {
              setIsDarkMode((prev) => !prev);
              showToast(!isDarkMode ? '🌙 Dark theme enabled' : '☀️ Light theme enabled');
            }}
            onOpenLanguage={() => setIsLanguageModalOpen(true)}
            onOpenSupport={() => setIsSupportModalOpen(true)}
            onOpenDocs={() => setIsDocsModalOpen(true)}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
            onOpenYieldCalculator={() => setIsYieldCalculatorOpen(true)}
            onOpenMaterialLister={() => setIsMaterialListerOpen(true)}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}
      </div>

      {/* Persistent Bottom Nav for Main Screens */}
      <BottomNav
        currentScreen={currentScreen}
        userRole={userRole}
        onNavigate={handleNavigate}
        onOpenSupport={() => setIsSupportModalOpen(true)}
        ordersCount={orders.filter((o) => o.status === 'in_transit').length}
      />

      {/* Global Modals & Overlays */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        currentLanguage={currentLanguage}
        onClose={() => setIsLanguageModalOpen(false)}
        onSelectLanguage={(lang) => {
          setCurrentLanguage(lang);
          showToast(`Language switched to ${lang}`);
        }}
      />

      <VoiceQueryModal
        isOpen={isVoiceModalOpen}
        context={voiceContext}
        currentLanguage={currentLanguage}
        onClose={() => setIsVoiceModalOpen(false)}
        onShowToast={showToast}
      />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        onOpenChat={() => setIsChatOpen(true)}
        onShowToast={showToast}
      />

      {/* Produce Origin Blockchain Traceability Modal */}
      <ProduceOriginModal
        isOpen={isOriginModalOpen}
        produce={originProduce}
        onClose={() => setIsOriginModalOpen(false)}
        onShowToast={showToast}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
      />

      {/* Device Camera QR Scanner Modal */}
      <CameraQRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={handleScanQRSuccess}
        onShowToast={showToast}
        products={products}
      />

      {/* Farmer & Vendor Reviews & Ratings Modal */}
      <VendorReviewsModal
        isOpen={isVendorReviewsOpen}
        onClose={() => setIsVendorReviewsOpen(false)}
        produce={vendorReviewProduct || selectedProduct}
        reviews={reviews}
        onAddReview={handleAddReview}
        onHelpfulClick={handleHelpfulClick}
        onShowToast={showToast}
      />

      {/* Android App & APK Build Hub Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Project Architectural Specs & PRD Modal */}
      <DocsViewerModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
        onShowToast={showToast}
      />

      {/* AI Crop Yield Prediction & Price Forecast Calculator Modal */}
      <YieldPredictionModal
        isOpen={isYieldCalculatorOpen}
        onClose={() => setIsYieldCalculatorOpen(false)}
        onApplyToListing={handleApplyYieldToListing}
        onShowToast={showToast}
      />

      {/* Farmer Daily Food Items & Farm Materials Lister Modal */}
      <FarmerMaterialListerModal
        isOpen={isMaterialListerOpen}
        onClose={() => setIsMaterialListerOpen(false)}
        onAddProduct={handleAddProduct}
        onShowToast={showToast}
        existingProducts={products}
      />

      {/* Soil Mate AI Chatbot Drawer & FAB */}
      {currentScreen !== 's-splash' && currentScreen !== 's-login' && (
        <ChatBotPanel
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen((prev) => !prev)}
          onClose={() => {
            setIsChatOpen(false);
            setActiveFarmerChat(undefined);
          }}
          onNavigate={handleNavigate}
          farmerName={activeFarmerChat}
        />
      )}

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </PhoneContainer>
  );
}
