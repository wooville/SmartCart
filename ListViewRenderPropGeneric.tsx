import React from "react";
// just leaving this as something to look into later potentially
// import {FlatList, StyleSheet, Text, View} from 'react-native';

// interface PropsType<T> {
//   items: T[];
//   renderer: (item: T) => React.ReactNode;
// }

// interface AbstractItem {
//   key: string;
// }

// export default function ListViewRenderPropGeneric<T extends AbstractItem>(
//   props: PropsType<T>
// ) {
//   return (
//     <FlatList>
//       {props.items.map((item) => {
//         return <li key={item.key}>{props.renderer(item)}</li>;
//       })}
//     </FlatList>
//   );
// }