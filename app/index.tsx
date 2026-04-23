import React, { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  Image,
  Modal,
  ScrollView,
  // useColorScheme,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Recipe {
  _id: string;
  name: string;
  image: string;
  region: string;
  dietaryrestrictions: string;
  ingredients: string[];
  instructions: string;
}

const App = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionList, setRegionList] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [dietList, setDietList] = useState<string[]>([]);
  const [selectedDiet, setSelectedDiet] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);


  useEffect(() => {
    fetch('https://foodrecipe-backend-3.onrender.com/recipes')
      .then((res) => res.json())
      .then((data: Recipe[]) => {
        setRecipes(data);
        setFilteredRecipes(data);
        setRegionList([...new Set(data.map(recipe => recipe.region))]);
        setDietList([...new Set(data.map(recipe => recipe.dietaryrestrictions))]);
      })
      .catch((err) => console.error('API Error:', err));
  }, []);

  const filterRecipes = () => {
    const filtered = recipes.filter((recipe) => {
      const matchName = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRegion = selectedRegion ? recipe.region === selectedRegion : true;
      const matchDiet = selectedDiet ? recipe.dietaryrestrictions === selectedDiet : true;
      return matchName && matchRegion && matchDiet;
    });
    setFilteredRecipes(filtered);
  };

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <View style={[styles.card, isDarkMode && styles.cardDark]}>
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <Text style={[styles.recipeTitle, isDarkMode && styles.textDark]}>{recipe.name}</Text>
      <Button title="Show Details" onPress={() => {
        setSelectedRecipe(recipe);
        setModalVisible(true);
      }} />
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Text style={[styles.header, isDarkMode && styles.textDark]}>Food Recipes</Text>

      <View style={styles.switchRow}>
        <Text style={[styles.text, isDarkMode && styles.textDark]}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={(val) => setIsDarkMode(val)}
        />
      </View>

      <TextInput
        style={[styles.input, isDarkMode && styles.inputDark]}
        placeholder="Search recipes..."
        placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {regionList.map((region, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.filterButton, selectedRegion === region && styles.filterSelected]}
            onPress={() => setSelectedRegion(region)}>
            <Text style={styles.filterText}>{region}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {dietList.map((diet, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.filterButton, selectedDiet === diet && styles.filterSelected]}
            onPress={() => setSelectedDiet(diet)}>
            <Text style={styles.filterText}>{diet}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Button title="Search" onPress={filterRecipes} />

      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
      />

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={[styles.modalContainer, isDarkMode && styles.containerDark]}>
          {selectedRecipe && (
            <>
              <Text style={[styles.modalTitle, isDarkMode && styles.textDark]}>{selectedRecipe.name}</Text>
              <Image source={{ uri: selectedRecipe.image }} style={styles.image} />
              <Text style={[styles.subHeading, isDarkMode && styles.textDark]}>Region: {selectedRecipe.region}</Text>
              <Text style={[styles.subHeading, isDarkMode && styles.textDark]}>Diet: {selectedRecipe.dietaryrestrictions}</Text>
              <Text style={[styles.subHeading, isDarkMode && styles.textDark]}>Ingredients:</Text>
              {selectedRecipe.ingredients.map((ing, i) => (
                <Text key={i} style={[styles.text, isDarkMode && styles.textDark]}>• {ing}</Text>
              ))}
              <Text style={[styles.subHeading, isDarkMode && styles.textDark]}>Instructions:</Text>
              <Text style={[styles.text, isDarkMode && styles.textDark]}>{selectedRecipe.instructions}</Text>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </>
          )}
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    color: '#000',
  },
  inputDark: {
    backgroundColor: '#1f1f1f',
    color: '#fff',
    borderColor: '#444',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  cardDark: {
    backgroundColor: '#1e1e1e',
    borderColor: '#333',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
    marginVertical: 8,
  },
  filterSelected: {
    backgroundColor: '#6495ed',
  },
  filterText: {
    color: '#000',
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  textDark: {
    color: '#eee',
  },
  modalContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 50,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
});

export default App;
