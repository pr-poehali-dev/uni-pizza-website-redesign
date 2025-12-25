import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import PizzaConstructor from '@/components/PizzaConstructor';

interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
}

interface CartItem extends Pizza {
  quantity: number;
}

const pizzas: Pizza[] = [
  {
    id: 1,
    name: 'Маргарита',
    description: 'Томатный соус, моцарелла, свежий базилик, оливковое масло',
    price: 590,
    image: 'https://cdn.poehali.dev/projects/06836954-9279-408e-a4ea-edc380de1a21/files/9bd8b2a8-2724-427f-bd89-9699891ade68.jpg',
    category: 'Классические',
    popular: true
  },
  {
    id: 2,
    name: 'Пепперони',
    description: 'Томатный соус, моцарелла, пепперони, орегано',
    price: 720,
    image: 'https://cdn.poehali.dev/projects/06836954-9279-408e-a4ea-edc380de1a21/files/45c60b6f-1ba5-4063-b910-ade61743133d.jpg',
    category: 'Классические',
    popular: true
  },
  {
    id: 3,
    name: 'Четыре сыра',
    description: 'Моцарелла, горгонзола, пармезан, дор блю, сливочный соус',
    price: 890,
    image: 'https://cdn.poehali.dev/projects/06836954-9279-408e-a4ea-edc380de1a21/files/4fd23e7d-98eb-407f-9334-f82d57723a65.jpg',
    category: 'Премиум',
    popular: true
  },
  {
    id: 4,
    name: 'Прошутто',
    description: 'Прошутто крудо, руккола, пармезан, томаты черри, соус песто',
    price: 1050,
    image: 'https://cdn.poehali.dev/projects/06836954-9279-408e-a4ea-edc380de1a21/files/9bd8b2a8-2724-427f-bd89-9699891ade68.jpg',
    category: 'Премиум'
  },
  {
    id: 5,
    name: 'Дьябола',
    description: 'Острая салями, перец халапеньо, моцарелла, острый соус',
    price: 780,
    image: 'https://cdn.poehali.dev/projects/06836954-9279-408e-a4ea-edc380de1a21/files/45c60b6f-1ba5-4063-b910-ade61743133d.jpg',
    category: 'Острые'
  },
  {
    id: 6,
    name: 'Тартюфо',
    description: 'Трюфельный крем, моцарелла, белые грибы, пармезан, трюфельное масло',
    price: 1290,
    image: 'https://cdn.poehali.dev/projects/06836954-9279-408e-a4ea-edc380de1a21/files/4fd23e7d-98eb-407f-9334-f82d57723a65.jpg',
    category: 'Премиум'
  }
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const categories = ['Все', 'Классические', 'Премиум', 'Острые'];

  const addToCart = (pizza: Pizza | { name: string; price: number; description: string }) => {
    setCart(prev => {
      const pizzaWithDefaults = {
        ...pizza,
        id: 'id' in pizza ? pizza.id : Date.now(),
        image: 'image' in pizza ? pizza.image : 'https://cdn.poehali.dev/projects/06836954-9279-408e-a4ea-edc380de1a21/files/9bd8b2a8-2724-427f-bd89-9699891ade68.jpg',
        category: 'category' in pizza ? pizza.category : 'Своя'
      } as Pizza;
      
      const existing = prev.find(item => item.id === pizzaWithDefaults.id);
      if (existing) {
        return prev.map(item =>
          item.id === pizzaWithDefaults.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...pizzaWithDefaults, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredPizzas = selectedCategory === 'Все' 
    ? pizzas 
    : pizzas.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Pizza" size={32} className="text-primary" />
            <h1 className="text-3xl font-bold text-primary">Uni-Pizza</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#menu" className="text-sm font-medium transition-colors hover:text-primary">Меню</a>
            <a href="#constructor" className="text-sm font-medium transition-colors hover:text-primary">Конструктор</a>
            <a href="#promo" className="text-sm font-medium transition-colors hover:text-primary">Акции</a>
            <a href="#loyalty" className="text-sm font-medium transition-colors hover:text-primary">Бонусы</a>
            <a href="#contacts" className="text-sm font-medium transition-colors hover:text-primary">Контакты</a>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Icon name="User" size={20} />
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                  <SheetDescription>
                    {cartCount > 0 ? `${cartCount} ${cartCount === 1 ? 'товар' : 'товара'}` : 'Корзина пуста'}
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-8 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Добавьте пиццу в корзину
                    </p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center gap-4">
                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="icon" variant="outline" onClick={() => removeFromCart(item.id)}>
                              <Icon name="Minus" size={16} />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button size="icon" variant="outline" onClick={() => addToCart(item)}>
                              <Icon name="Plus" size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Icon name="MapPin" size={20} className="text-muted-foreground" />
                          <Input 
                            placeholder="Адрес доставки" 
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                          />
                        </div>
                        
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Итого:</span>
                          <span>{cartTotal} ₽</span>
                        </div>
                        
                        <Button className="w-full" size="lg" disabled={cart.length === 0 || !deliveryAddress}>
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-secondary/70 z-10" />
        <img 
          src="https://cdn.poehali.dev/projects/06836954-9279-408e-a4ea-edc380de1a21/files/9bd8b2a8-2724-427f-bd89-9699891ade68.jpg" 
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="container relative z-20 text-center text-white animate-fade-in">
          <h2 className="text-6xl md:text-7xl font-bold mb-6">
            Итальянская пицца<br />в вашем городе
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Аутентичные рецепты, свежие ингредиенты, быстрая доставка
          </p>
          <Button size="lg" className="text-lg px-8 py-6">
            Смотреть меню
            <Icon name="ArrowRight" size={20} className="ml-2" />
          </Button>
        </div>
      </section>

      <section id="constructor" className="py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl font-bold mb-4">Соберите свою пиццу</h2>
            <p className="text-xl text-muted-foreground">Выбирайте ингредиенты по своему вкусу</p>
          </div>
          
          <PizzaConstructor onAddToCart={addToCart} />
        </div>
      </section>

      <section id="menu" className="py-20">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl font-bold mb-4">Готовые пиццы</h2>
            <p className="text-xl text-muted-foreground">Или выберите из нашего меню</p>
          </div>

          <div className="flex justify-center gap-2 mb-12 flex-wrap">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="animate-scale-in"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPizzas.map((pizza, index) => (
              <Card 
                key={pizza.id} 
                className="overflow-hidden transition-all hover:shadow-xl animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <img 
                    src={pizza.image} 
                    alt={pizza.name}
                    className="w-full h-64 object-cover transition-transform hover:scale-105"
                  />
                  {pizza.popular && (
                    <Badge className="absolute top-4 right-4 bg-accent">
                      Популярное
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl">{pizza.name}</CardTitle>
                    <Badge variant="outline">{pizza.category}</Badge>
                  </div>
                  <CardDescription className="text-base">{pizza.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">{pizza.price} ₽</span>
                  <Button onClick={() => addToCart(pizza)}>
                    <Icon name="ShoppingCart" size={18} className="mr-2" />
                    В корзину
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in">
              <Icon name="Clock" size={48} className="mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Быстрая доставка</h3>
              <p className="text-muted-foreground">От 30 минут по всему городу</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <Icon name="Award" size={48} className="mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Премиум качество</h3>
              <p className="text-muted-foreground">Только свежие ингредиенты</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <Icon name="Gift" size={48} className="mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Бонусная программа</h3>
              <p className="text-muted-foreground">Скидки постоянным клиентам</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Pizza" size={28} className="text-primary" />
                <h3 className="text-xl font-bold">Uni-Pizza</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Сеть пиццерий премиум-класса
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Меню</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Пиццы</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Конструктор</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Акции</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Информация</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Доставка</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Оплата</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (800) 555-35-35
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  info@unipizza.ru
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <p className="text-center text-sm text-muted-foreground">
            © 2024 Uni-Pizza. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}