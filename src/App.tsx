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
import { motion, AnimatePresence } from 'framer-motion';
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
import { AdminDashboardScreen } from './components/AdminDashboardScreen';
import { Toast } from './components/Toast';
import { api } from './services/api';

export default function App() {
  // Authentication State
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const savedUser = localStorage.getItem('soilMatesUser');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        return parsed.role?.toLowerCase() || 'consumer';
      } catch {
        return 'consumer';
      }
    }
    return 'farmer';
  });

  // Startup Route: If already authenticated skip Login; if unauthenticated open Login directly
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => {
    const savedToken = localStorage.getItem('soilMatesToken');
    const savedUser = localStorage.getItem('soilMatesUser');
    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const r = parsed.role?.toLowerCase();
        return r === 'farmer' ? 's-farmer' : r === 'admin' ? 's-admin' : r === 'vendor' ? 's-vendor' : 's-home';
      } catch {
        return 's-home';
      }
    }
    // Unauthenticated user flow: OPEN APK -> LOGIN PAGE DIRECTLY
    return 's-login';
  });
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

  // Initial load from backend API
  useEffect(() => {
    const initBackendData = async () => {
      try {
        const [prodRes, ordRes] = await Promise.all([
          api.getProducts().catch(() => ({ success: false, data: [] as any[] })),
          api.getOrders().catch(() => ({ success: false, data: [] as any[] }))
        ]);
        const prodData = (prodRes as any).data;
        if (prodRes.success && Array.isArray(prodData) && prodData.length > 0) {
          const mapped: ProduceItem[] = prodData.map((p: any) => ({
            id: p.id || p._id,
            name: p.name,
            category: p.category,
            emoji: p.emoji || '🌾',
            farmName: p.farmName || 'Farmer Farm',
            location: p.location || 'Madhya Pradesh',
            pricePerKg: p.price,
            unit: p.unit || 'kg',
            availableKg: p.quantity,
            rating: p.rating || 4.8,
            reviewsCount: p.reviewsCount || 10,
            vendorTrustScore: p.vendorTrustScore || 95,
            repeatBuyerRate: p.repeatBuyerRate || 85,
            isFreshToday: p.isFreshToday ?? true,
            isOrganic: p.isOrganic ?? false,
            deliveryHours: p.deliveryHours || 3,
            farmerAadhaarVerified: true,
            harvestTime: p.harvestTime || 'Fresh Today',
            grade: p.grade || 'Grade A',
            description: p.description || ''
          }));
          setProducts(mapped);
          setSelectedProduct(mapped[0]);
        }
      } catch (err) {
        console.warn('[App] Backend init notice:', err);
      }
    };
    initBackendData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const handleNavigate = (screen: ScreenId) => {
    // Strict guard: splash screen is completely removed from navigation
    if ((screen as string) === 's-splash') {
      const token = localStorage.getItem('soilMatesToken');
      setCurrentScreen(token ? 's-home' : 's-login');
      setIsChatOpen(false);
      return;
    }
    setCurrentScreen(screen);
    setIsChatOpen(false);
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === 'admin') {
      setCurrentScreen('s-admin');
      showToast('🛡️ Welcome, Platform Administrator! Command Center online.');
    } else if (role === 'vendor') {
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

  const handlePlaceOrder = async (newOrder: OrderItem) => {
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrder(newOrder);

    // Persist to backend database API
    try {
      await api.createOrder({
        items: cart.map((c) => ({ productId: c.produce.id, quantity: c.quantity })),
        deliveryAddress: {
          street: 'Arera Colony Phase 2',
          city: 'Bhopal',
          state: 'Madhya Pradesh',
          pincode: '462016'
        }
      });
      console.log('[App] Order persisted to Soil Mates API');
    } catch (err) {
      console.warn('[App] Local order placed, API sync note:', err);
    }
    setCart([]);
  };

  const handleAddProduct = async (newProduct: ProduceItem) => {
    setProducts((prev) => [newProduct, ...prev]);
    try {
      await api.createProduct({
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.pricePerKg,
        unit: newProduct.unit,
        quantity: newProduct.availableKg,
        location: newProduct.location,
        farmName: newProduct.farmName,
        emoji: newProduct.emoji,
        grade: newProduct.grade,
        isOrganic: newProduct.isOrganic,
        description: newProduct.description
      });
      showToast(`🌾 ${newProduct.name} saved to marketplace & database!`);
    } catch (err) {
      console.warn('[App] Local product added:', err);
    }
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

  const renderScreenContent = () => {
    switch (currentScreen) {
      case 's-login':
        return (
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
        );
      case 's-home':
        return (
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
        );
      case 's-farmer':
        return (
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
        );
      case 's-vendor':
        return (
          <VendorHubScreen
            onNavigate={handleNavigate}
            onOpenSupport={() => setIsSupportModalOpen(true)}
            onStartVoice={handleStartVoice}
            onOpenChat={() => setIsChatOpen(true)}
          />
        );
      case 's-ai':
        return (
          <AiDoctorScreen
            onNavigate={handleNavigate}
            onSetDiagnosis={setCurrentDiagnosis}
            onStartVoice={handleStartVoice}
            onShowToast={showToast}
          />
        );
      case 's-result':
        return (
          <DiagnosisResultScreen
            diagnosis={currentDiagnosis}
            onNavigate={handleNavigate}
            onAddToCart={(medicine) => handleAddToCart(medicine, 1)}
            onShowToast={showToast}
          />
        );
      case 's-market':
        return (
          <MarketScreen
            onNavigate={handleNavigate}
            onShowToast={showToast}
            onOpenOriginModal={handleOpenOriginModal}
            onOpenQRScanner={() => setIsQRScannerOpen(true)}
          />
        );
      case 's-buy':
        return (
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
        );
      case 's-sell':
        return (
          <SellProduceScreen
            onNavigate={handleNavigate}
            onAddProduct={handleAddProduct}
            onShowToast={showToast}
            onOpenYieldCalculator={() => setIsYieldCalculatorOpen(true)}
          />
        );
      case 's-cart':
        return (
          <CartScreen
            cart={cart}
            onNavigate={handleNavigate}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onPlaceOrder={handlePlaceOrder}
            onShowToast={showToast}
          />
        );
      case 's-orders':
        return (
          <OrdersScreen
            orders={orders}
            onNavigate={handleNavigate}
            onSelectOrder={setSelectedOrder}
            onShowToast={showToast}
          />
        );
      case 's-track':
        return (
          <TrackOrderScreen
            order={selectedOrder}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        );
      case 's-profile':
        return (
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
        );
      case 's-admin':
        return (
          <AdminDashboardScreen
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        );
      default:
        return (
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
        );
    }
  };

  return (
    <PhoneContainer onOpenInstallModal={() => setIsInstallModalOpen(true)}>
      {/* Dynamic Screen Routing with Framer Motion Screen Transitions */}
      <div className="relative flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
            className="flex-1 flex flex-col overflow-hidden w-full h-full"
          >
            {renderScreenContent()}
          </motion.div>
        </AnimatePresence>
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
        onSelectOption={(roleStr) => {
          handleLogin(roleStr as UserRole);
          setIsVoiceModalOpen(false);
        }}
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
