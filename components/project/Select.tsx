import { borderRadius, colors, fontSize, spacing } from "@/constants/theme";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet, Text, View
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { useState } from "react";

interface SelectOptions
{
    label:string,
    value:string
}

interface SelectProps
{
    label:string,
    options:SelectOptions[],
    selectedValue:string,
    onValueChange: (value:string)=> void,
    placeholder?: string
}



export function Select(
{
label,
options,
selectedValue,
onValueChange,
placeholder

}: SelectProps)
{
    const[modalVisible, setModalVisible] = useState(false)
    const selectedOption = options.find(opt =>opt.value === selectedValue)
    const displayText = selectedOption?.label || placeholder

    function handleChange(value:string)
    {
        onValueChange(value)
    }

    return (
        <View style={styles.container}>
            {label && (
                <Text style={styles.label}>
                    {label}
                </Text>
            )}

            <Pressable style={styles.selectButton}
            onPress={()=>{setModalVisible(true)}}>
                <Text style={styles.selectText}>
                   {displayText}
                </Text>

                <Feather name="chevron-down" size={14}
                color={colors.textFieldColor}/>

            </Pressable>

            <Modal visible ={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}>

                <Pressable
                style={styles.modalOverlay}
                onPress={() => setModalVisible(false)}>

                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                              {  label || "Selecione uma opção"}
                            </Text>

                            <Pressable onPress={() => 
                                setModalVisible(false)}>
                                <Feather name="x"
                                color={colors.blue}
                                size={24}/>
                            </Pressable>
                        </View>
                        
                        <FlatList
                            data={options}
                            keyExtractor={(item) =>item.value}
                            renderItem={({item}) =>
                            (
                                <Pressable style={styles.optionItem}
                                onPress={() =>handleChange(item.value)}>
                                    <Text style={[styles.optionText,
                                        item.value === selectedValue &&
                                            styles.optionSelected
                                    ]}>
                                        {item.label}
                                    </Text>
                                </Pressable>
                            )
                            }
                        />

                    </View>
                    
                </Pressable>

            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({

    container:
    {
        // width:"100%",
        width:"72%" ,
        paddingBottom:25// da proxima, qualquer coisa , vem aqui, ok?
    },
    label:
    {
        color:colors.primary,
        fontSize:fontSize.lg,
        marginBottom:spacing.sm,
        fontWeight:"bold"

    },
    selectButton:
    {
         //backgroundColor:colors.background,
         backgroundColor: '#eff3fd',

        borderRadius:borderRadius.md,
        borderWidth:1,
        borderColor:colors.textFieldColor,
        height:45,
        alignItems:"center",
        justifyContent:"space-between",
        flexDirection:"row",
        paddingHorizontal:spacing.md

    },
    selectText:
    {
        //color:colors.primary,
        color:'#000',
        flex:1
    },
    placeholderText:
    {
        color:colors.gray
    },

    modalOverlay:
    {
        flex:1,
        //backgroundColor:"rgba(0, 0, 0, 0.6)",
        backgroundColor:colors.textFieldColor,
        justifyContent:"center",
        alignItems:"center",
        padding:spacing.lg
    },  

    modalContent:
    {
        backgroundColor:colors.background,
        width:"92%",
        maxHeight:"70%",
        borderWidth: 1,
        borderColor:colors.borderColor,
        borderRadius:borderRadius.lg
    },
    modalHeader:
    {
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        padding:spacing.md,
        borderBottomWidth:1,
        borderBottomColor:colors.borderColor
    },

    modalTitle:
    {
        color:colors.primary,
        fontSize:fontSize.lg
    },
    optionItem:
    {
        padding:spacing.md,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },

    optionText:
    {
        color:colors.primary
    }
,
    optionSelected:
    {
        color:colors.blue,
        fontWeight:"bold"
    }

})

