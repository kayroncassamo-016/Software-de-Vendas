// import {
//     Cog,
//     Handshake,
//     Menu,
//     Package,
//     ShoppingBag,
//     Truck,
//     X,
// } from 'lucide-react-native';
// import React, { useState } from 'react';
// import {
//     Modal,
//     Pressable,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';

// interface SidebarProps {
//   onNavigate: (page: string) => void;
//   activeNav: string;
// }

// export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activeNav }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const menuItems = [
//     { icon: ShoppingBag, label: 'Vendas', id: 'vendas' },
//     { icon: Handshake, label: 'Clientes', id: 'clientes' },
//     { icon: Package, label: 'Produtos', id: 'produtos' },
//     { icon: Truck, label: 'Fornecedores', id: 'fornecedores' },
//     { icon: Cog, label: 'Configurações', id: 'config' },
//   ];

//   const handleNavigate = (id: string) => {
//     onNavigate(id);
//     setIsOpen(false);
//   };

//   return (
//     <>
//       {/* Botão Hamburger */}
//       <TouchableOpacity
//         style={styles.hamburgerBtn}
//         onPress={() => setIsOpen(true)}
//       >
//         <Menu size={24} color="#185FA5" />
//       </TouchableOpacity>

//       {/* Modal com Sidebar */}
//       <Modal
//         visible={isOpen}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setIsOpen(false)}
//       >
//         {/* Overlay */}
//         <Pressable
//           style={styles.overlay}
//           onPress={() => setIsOpen(false)}
//         />

//         {/* Sidebar */}
//         <View style={styles.sidebarContainer}>
//           <View style={styles.sidebar}>
//             {/* Header */}
//             <View style={styles.sidebarHeader}>
//               <Text style={styles.sidebarTitle}>Menu</Text>
//               <TouchableOpacity
//                 onPress={() => setIsOpen(false)}
//                 hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//               >
//                 <X size={24} color="#185FA5" />
//               </TouchableOpacity>
//             </View>

//             {/* Divider */}
//             <View style={styles.divider} />

//             {/* Menu Items */}
//             <ScrollView
//               showsVerticalScrollIndicator={false}
//               style={styles.menuList}
//             >
//               {menuItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = activeNav === item.id;

//                 return (
//                   <TouchableOpacity
//                     key={item.id}
//                     style={[
//                       styles.menuItem,
//                       isActive && styles.menuItemActive,
//                     ]}
//                     onPress={() => handleNavigate(item.id)}
//                     activeOpacity={0.7}
//                   >
//                     <Icon
//                       size={20}
//                       color={isActive ? '#185FA5' : '#8E8E93'}
//                     />
//                     <Text
//                       style={[
//                         styles.menuItemText,
//                         isActive && styles.menuItemTextActive,
//                       ]}
//                     >
//                       {item.label}
//                     </Text>
//                     {isActive && (
//                       <View style={styles.activeIndicator} />
//                     )}
//                   </TouchableOpacity>
//                 );
//               })}
//             </ScrollView>

//             {/* Footer Info */}
//             <View style={styles.sidebarFooter}>
//               <Text style={styles.footerText}>FacturaMoz v1.0</Text>
//               <Text style={styles.footerSubtext}>© 2024</Text>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   hamburgerBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#F2F2F7',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   sidebarContainer: {
//     flexDirection: 'row',
//     flex: 1,
//   },
//   sidebar: {
//     width: 280,
//     backgroundColor: '#fff',
//     paddingTop: 50,
//     paddingBottom: 20,
//     paddingHorizontal: 0,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 2, height: 0 },
//     shadowRadius: 8,
//   },
//   sidebarHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingBottom: 15,
//   },
//   sidebarTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#1C1C1E',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#E5E5EA',
//     marginBottom: 10,
//   },
//   menuList: {
//     flex: 1,
//     paddingHorizontal: 0,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     marginVertical: 4,
//     marginHorizontal: 10,
//     borderRadius: 10,
//     gap: 12,
//   },
//   menuItemActive: {
//     backgroundColor: '#EBF3FF',
//     borderLeftWidth: 4,
//     borderLeftColor: '#185FA5',
//     paddingLeft: 16,
//   },
//   menuItemText: {
//     fontSize: 15,
//     color: '#8E8E93',
//     fontWeight: '500',
//     flex: 1,
//   },
//   menuItemTextActive: {
//     color: '#185FA5',
//     fontWeight: '600',
//   },
//   activeIndicator: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#185FA5',
//   },
//   sidebarFooter: {
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderTopWidth: 1,
//     borderTopColor: '#E5E5EA',
//     marginTop: 10,
//   },
//   footerText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#1C1C1E',
//   },
//   footerSubtext: {
//     fontSize: 11,
//     color: '#8E8E93',
//     marginTop: 4,
//   },
// });

import {
    Cog,
    Handshake,
    Menu,
    Package,
    ShoppingBag,
    Truck,
    X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface SidebarProps {
  onNavigate: (page: string) => void;
  activeNav: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onNavigate,
  activeNav,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: ShoppingBag, label: "Vendas", id: "vendas" },
    { icon: Handshake, label: "Clientes", id: "clientes" },
    { icon: Package, label: "Produtos", id: "produtos" },
    { icon: Truck, label: "Fornecedores", id: "fornecedores" },
    { icon: Cog, label: "Configurações", id: "config" },
  ];

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.hamburgerBtn}
        onPress={() => setIsOpen(true)}
      >
        <Menu size={24} color="#185FA5" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalContainer}>
          {/* Sidebar */}
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Menu</Text>

              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                hitSlop={{
                  top: 10,
                  bottom: 10,
                  left: 10,
                  right: 10,
                }}
              >
                <X size={24} color="#185FA5" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <ScrollView
              style={styles.menuList}
              showsVerticalScrollIndicator={false}
            >
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItem,
                      isActive && styles.menuItemActive,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handleNavigate(item.id)}
                  >
                    <Icon
                      size={20}
                      color={
                        isActive
                          ? "#185FA5"
                          : "#8E8E93"
                      }
                    />

                    <Text
                      style={[
                        styles.menuItemText,
                        isActive &&
                          styles.menuItemTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>

                    {isActive && (
                      <View
                        style={styles.activeIndicator}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.sidebarFooter}>
              <Text style={styles.footerText}>
                 Software de Vendas
              </Text>

              <Text style={styles.footerSubtext}>
                © {new Date().getFullYear()}
              </Text>
            </View>
          </View>

          {/* Overlay */}
          <Pressable
            style={styles.overlay}
            onPress={() => setIsOpen(false)}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  hamburgerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,

    elevation: 3,
  },

  modalContainer: {
    flex: 1,
    flexDirection: "row",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  sidebar: {
    width: 280,
    height: "100%",
    backgroundColor: "#fff",

    paddingTop: 50,
    paddingBottom: 20,

    elevation: 5,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowRadius: 8,
  },

  sidebarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: 20,
    paddingBottom: 15,
  },

  sidebarTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1C1E",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E5EA",
    marginBottom: 10,
  },

  menuList: {
    flex: 1,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 14,
    paddingHorizontal: 20,

    marginVertical: 4,
    marginHorizontal: 10,

    borderRadius: 10,
    gap: 12,
  },

  menuItemActive: {
    backgroundColor: "#EBF3FF",

    borderLeftWidth: 4,
    borderLeftColor: "#185FA5",

    paddingLeft: 16,
  },

  menuItemText: {
    flex: 1,

    fontSize: 15,
    color: "#8E8E93",
    fontWeight: "500",
  },

  menuItemTextActive: {
    color: "#185FA5",
    fontWeight: "600",
  },

  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#185FA5",
  },

  sidebarFooter: {
    paddingHorizontal: 20,
    paddingVertical: 15,

    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },

  footerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1C1C1E",
  },

  footerSubtext: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 4,
  },
});
