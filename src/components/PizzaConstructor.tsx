import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Ingredient {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface PizzaConfiguration {
  size: 'small' | 'medium' | 'large';
  dough: 'traditional' | 'thin' | 'thick';
  sauce: string;
  ingredients: string[];
}

const sizes = [
  { id: 'small', name: '25 см', price: 0, servings: '1-2' },
  { id: 'medium', name: '30 см', price: 150, servings: '2-3' },
  { id: 'large', name: '35 см', price: 300, servings: '3-4' }
];

const doughTypes = [
  { id: 'traditional', name: 'Традиционное', price: 0 },
  { id: 'thin', name: 'Тонкое', price: 0 },
  { id: 'thick', name: 'Пышное', price: 50 }
];

const sauces = [
  { id: 'tomato', name: 'Томатный', price: 0 },
  { id: 'cream', name: 'Сливочный', price: 30 },
  { id: 'pesto', name: 'Песто', price: 50 },
  { id: 'bbq', name: 'Барбекю', price: 40 }
];

const ingredients: Ingredient[] = [
  { id: 'mozzarella', name: 'Моцарелла', price: 80, category: 'cheese' },
  { id: 'parmesan', name: 'Пармезан', price: 100, category: 'cheese' },
  { id: 'gorgonzola', name: 'Горгонзола', price: 120, category: 'cheese' },
  { id: 'cheddar', name: 'Чеддер', price: 90, category: 'cheese' },
  
  { id: 'pepperoni', name: 'Пепперони', price: 150, category: 'meat' },
  { id: 'ham', name: 'Ветчина', price: 120, category: 'meat' },
  { id: 'bacon', name: 'Бекон', price: 140, category: 'meat' },
  { id: 'chicken', name: 'Курица', price: 130, category: 'meat' },
  { id: 'salami', name: 'Салями', price: 140, category: 'meat' },
  
  { id: 'mushrooms', name: 'Шампиньоны', price: 70, category: 'vegetables' },
  { id: 'tomatoes', name: 'Томаты', price: 60, category: 'vegetables' },
  { id: 'olives', name: 'Оливки', price: 80, category: 'vegetables' },
  { id: 'peppers', name: 'Болгарский перец', price: 70, category: 'vegetables' },
  { id: 'onion', name: 'Красный лук', price: 50, category: 'vegetables' },
  { id: 'arugula', name: 'Руккола', price: 90, category: 'vegetables' },
  { id: 'jalapeno', name: 'Халапеньо', price: 100, category: 'vegetables' }
];

const categoryNames = {
  cheese: 'Сыры',
  meat: 'Мясо',
  vegetables: 'Овощи'
};

interface PizzaConstructorProps {
  onAddToCart: (pizza: { name: string; price: number; description: string }) => void;
}

export default function PizzaConstructor({ onAddToCart }: PizzaConstructorProps) {
  const [config, setConfig] = useState<PizzaConfiguration>({
    size: 'medium',
    dough: 'traditional',
    sauce: 'tomato',
    ingredients: ['mozzarella']
  });

  const toggleIngredient = (id: string) => {
    setConfig(prev => ({
      ...prev,
      ingredients: prev.ingredients.includes(id)
        ? prev.ingredients.filter(i => i !== id)
        : [...prev.ingredients, id]
    }));
  };

  const calculatePrice = () => {
    let total = 490;
    
    const selectedSize = sizes.find(s => s.id === config.size);
    if (selectedSize) total += selectedSize.price;
    
    const selectedDough = doughTypes.find(d => d.id === config.dough);
    if (selectedDough) total += selectedDough.price;
    
    const selectedSauce = sauces.find(s => s.id === config.sauce);
    if (selectedSauce) total += selectedSauce.price;
    
    config.ingredients.forEach(ingId => {
      const ing = ingredients.find(i => i.id === ingId);
      if (ing) total += ing.price;
    });
    
    return total;
  };

  const handleAddToCart = () => {
    const selectedIngredients = config.ingredients
      .map(id => ingredients.find(i => i.id === id)?.name)
      .filter(Boolean);
    
    onAddToCart({
      name: 'Своя пицца',
      price: calculatePrice(),
      description: `${sizes.find(s => s.id === config.size)?.name}, ${doughTypes.find(d => d.id === config.dough)?.name.toLowerCase()} тесто, соус ${sauces.find(s => s.id === config.sauce)?.name.toLowerCase()}, ${selectedIngredients.join(', ')}`
    });
  };

  const groupedIngredients = ingredients.reduce((acc, ing) => {
    if (!acc[ing.category]) acc[ing.category] = [];
    acc[ing.category].push(ing);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-3xl">Конструктор пиццы</CardTitle>
        <CardDescription className="text-base">
          Создайте пиццу по вашему вкусу
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Icon name="Maximize" size={20} className="text-primary" />
            Размер
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {sizes.map(size => (
              <Button
                key={size.id}
                variant={config.size === size.id ? 'default' : 'outline'}
                onClick={() => setConfig(prev => ({ ...prev, size: size.id as any }))}
                className="h-auto py-4 flex flex-col gap-1"
              >
                <span className="font-semibold">{size.name}</span>
                <span className="text-xs opacity-80">{size.servings} порции</span>
                {size.price > 0 && <Badge variant="secondary" className="mt-1">+{size.price} ₽</Badge>}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Icon name="Cookie" size={20} className="text-primary" />
            Тесто
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {doughTypes.map(dough => (
              <Button
                key={dough.id}
                variant={config.dough === dough.id ? 'default' : 'outline'}
                onClick={() => setConfig(prev => ({ ...prev, dough: dough.id as any }))}
                className="h-auto py-4 flex flex-col gap-1"
              >
                <span className="font-semibold">{dough.name}</span>
                {dough.price > 0 && <Badge variant="secondary" className="mt-1">+{dough.price} ₽</Badge>}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Icon name="Soup" size={20} className="text-primary" />
            Соус
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sauces.map(sauce => (
              <Button
                key={sauce.id}
                variant={config.sauce === sauce.id ? 'default' : 'outline'}
                onClick={() => setConfig(prev => ({ ...prev, sauce: sauce.id }))}
                className="h-auto py-4 flex flex-col gap-1"
              >
                <span className="font-semibold">{sauce.name}</span>
                {sauce.price > 0 && <Badge variant="secondary" className="mt-1">+{sauce.price} ₽</Badge>}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Icon name="UtensilsCrossed" size={20} className="text-primary" />
            Ингредиенты
          </h3>
          
          <Tabs defaultValue="cheese" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cheese">Сыры</TabsTrigger>
              <TabsTrigger value="meat">Мясо</TabsTrigger>
              <TabsTrigger value="vegetables">Овощи</TabsTrigger>
            </TabsList>
            
            {Object.entries(groupedIngredients).map(([category, items]) => (
              <TabsContent key={category} value={category} className="space-y-3 mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {items.map(ingredient => {
                    const isSelected = config.ingredients.includes(ingredient.id);
                    return (
                      <Button
                        key={ingredient.id}
                        variant={isSelected ? 'default' : 'outline'}
                        onClick={() => toggleIngredient(ingredient.id)}
                        className="h-auto py-3 flex flex-col gap-1 relative"
                      >
                        {isSelected && (
                          <Icon name="Check" size={16} className="absolute top-2 right-2" />
                        )}
                        <span className="font-medium">{ingredient.name}</span>
                        <Badge variant="secondary">+{ingredient.price} ₽</Badge>
                      </Button>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Ваша пицца:</h4>
          <p className="text-sm text-muted-foreground">
            {sizes.find(s => s.id === config.size)?.name} • {' '}
            {doughTypes.find(d => d.id === config.dough)?.name.toLowerCase()} тесто • {' '}
            Соус {sauces.find(s => s.id === config.sauce)?.name.toLowerCase()}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {config.ingredients.map(id => {
              const ing = ingredients.find(i => i.id === id);
              return ing ? (
                <Badge key={id} variant="outline" className="text-xs">
                  {ing.name}
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <div className="text-left">
          <p className="text-sm text-muted-foreground">Итоговая стоимость</p>
          <p className="text-3xl font-bold text-primary">{calculatePrice()} ₽</p>
        </div>
        <Button size="lg" onClick={handleAddToCart} className="gap-2">
          <Icon name="ShoppingCart" size={20} />
          Добавить в корзину
        </Button>
      </CardFooter>
    </Card>
  );
}
