import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Task from './TaskItem';

export default function App() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);
  const swipeableRefs = useRef(new Map());

  const handleAddTask = () => {
    Keyboard.dismiss();
    if (task && task.trim() !== '') {
      setTaskItems([...taskItems, task]);
      setTask('');
    } else {
      alert('Your task cannot be empty');
    }
  };

  const completeTask = (index) => {
    setTaskItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  useEffect(() => {
    swipeableRefs.current.forEach((ref) => ref?.close());
  }, [taskItems]);

  const LeftAction = () => (
    <View style={styles.deleteSwipe}/>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>

        <FlatList
          data={taskItems}
          renderItem={({ item, index }) => (
            <Swipeable
              ref={(ref) => {
                if (ref) {
                  swipeableRefs.current.set(index, ref);
                } else {
                  swipeableRefs.current.delete(index);
                }
              }}
              renderLeftActions={LeftAction}
              onSwipeableOpen={() => completeTask(index)}
            >
              <Task text={item} />
            </Swipeable>
          )}
          keyExtractor={(item, index) => index.toString()}
          style={styles.items}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.writeTaskWrapper}
      >
        <TextInput
          style={styles.input}
          placeholder="Write a task"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity onPress={handleAddTask}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  tasksWrapper: {
    flex: 1,
    paddingTop: 80,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    marginHorizontal: 2,
    marginLeft: 20,
    color: '#a53860',
  },
  items: {
    flex: 1,
  },
  writeTaskWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    marginBottom: 30,
  },
  input: {
    paddingVertical: 15,
    width: 275,
    paddingLeft: 15,
    backgroundColor: '#ffa5ab',
    borderRadius: 60,
    borderColor: '#a53860',
    borderWidth: 2,
    color: '#450920',
  },
  addWrapper: {
    width: 55,
    height: 55,
    backgroundColor: '#ffa5ab',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#a53860',
    borderWidth: 2,
  },
  addText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#a53860',
  },
  deleteSwipe: {
    backgroundColor: '#a53860',
    width: '100%',
  },
});
