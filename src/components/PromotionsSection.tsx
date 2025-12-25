import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Promotion {
  id: number;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  image: string;
  tag: string;
  items: string[];
  validUntil?: Date;
}

const promotions: Promotion[] = [
  {
    id: 1,
    title: 'Дуэт для двоих',
    description: 'Две большие пиццы на выбор из классического меню',
    originalPrice: 1800,
    discountPrice: 1290,
    image: 'https://cdn.poehali.dev/projects/06836954-9279-408e-a4ea-edc380de1a21/files/ddf2275a-1e6d-41be-b945-19c43850d7ed.jpg',
    tag: 'Хит',
    items: ['2 большие пиццы', 'На выбор из меню']
  },
  {
    id: 2,
    title: 'Семейный вечер',
    description: 'Три пиццы, картофель фри и напитки на всю семью',
    originalPrice: 2800,
    discountPrice: 1990,
    image: 'https://cdn.poehali.dev/projects/06836954-9279-408e-a4ea-edc380de1a21/files/4901bfb4-456c-44d6-9a37-62fd81151f8a.jpg',
    tag: 'Семейный',
    items: ['3 средние пиццы', 'Картофель фри', '2 л напитков']
  },
  {
    id: 3,
    title: 'Пятничная акция',
    description: 'Скидка 30% на все премиум пиццы по пятницам',
    originalPrice: 1290,
    discountPrice: 903,
    image: 'https://cdn.poehali.dev/projects/06836954-9279-408e-a4ea-edc380de1a21/files/4fd23e7d-98eb-407f-9334-f82d57723a65.jpg',
    tag: 'Только в пятницу',
    items: ['Премиум пиццы', 'Скидка 30%'],
    validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 4,
    title: 'Ланч-комбо',
    description: 'Идеальный вариант для обеда в будни',
    originalPrice: 890,
    discountPrice: 590,
    image: 'https://cdn.poehali.dev/projects/06836954-9279-408e-a4ea-edc380de1a21/files/9bd8b2a8-2724-427f-bd89-9699891ade68.jpg',
    tag: 'Будни 12:00-16:00',
    items: ['Средняя пицца', 'Напиток', 'Десерт']
  }
];

interface PromotionsSectionProps {
  onAddToCart: (item: { name: string; price: number; description: string }) => void;
}

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-2 justify-center">
      <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 min-w-[50px] text-center">
        <div className="text-xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
        <div className="text-xs">часов</div>
      </div>
      <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 min-w-[50px] text-center">
        <div className="text-xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
        <div className="text-xs">минут</div>
      </div>
      <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 min-w-[50px] text-center">
        <div className="text-xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
        <div className="text-xs">секунд</div>
      </div>
    </div>
  );
}

export default function PromotionsSection({ onAddToCart }: PromotionsSectionProps) {
  const handleAddPromotion = (promo: Promotion) => {
    onAddToCart({
      name: promo.title,
      price: promo.discountPrice,
      description: promo.description
    });
  };

  const calculateDiscount = (original: number, discount: number) => {
    return Math.round(((original - discount) / original) * 100);
  };

  return (
    <section id="promo" className="py-20 bg-gradient-to-b from-background to-muted">
      <div className="container">
        <div className="text-center mb-12 animate-fade-in">
          <Badge className="mb-4 text-sm px-4 py-1">
            <Icon name="Sparkles" size={16} className="mr-1" />
            Специальные предложения
          </Badge>
          <h2 className="text-5xl font-bold mb-4">Акции и комбо</h2>
          <p className="text-xl text-muted-foreground">Выгодные предложения для вас</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {promotions.map((promo, index) => (
            <Card 
              key={promo.id}
              className="overflow-hidden transition-all hover:shadow-2xl animate-fade-in group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={promo.image} 
                  alt={promo.title}
                  className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-accent text-accent-foreground">
                    {promo.tag}
                  </Badge>
                  <Badge variant="destructive" className="font-bold">
                    -{calculateDiscount(promo.originalPrice, promo.discountPrice)}%
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-2xl">{promo.title}</CardTitle>
                <CardDescription className="text-base">{promo.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {promo.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Icon name="Check" size={16} className="text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {promo.validUntil && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-center mb-3 font-medium">
                      Акция заканчивается через:
                    </p>
                    <CountdownTimer targetDate={promo.validUntil} />
                  </div>
                )}

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">
                    {promo.discountPrice} ₽
                  </span>
                  <span className="text-xl text-muted-foreground line-through">
                    {promo.originalPrice} ₽
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    Выгода {promo.originalPrice - promo.discountPrice} ₽
                  </Badge>
                </div>
              </CardContent>

              <CardFooter>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => handleAddPromotion(promo)}
                >
                  <Icon name="ShoppingCart" size={20} className="mr-2" />
                  Заказать комбо
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="inline-block bg-accent/10 border-accent">
            <CardContent className="pt-6 flex items-center gap-4">
              <Icon name="Gift" size={48} className="text-accent" />
              <div className="text-left">
                <h3 className="text-xl font-bold mb-1">Первый заказ со скидкой 20%</h3>
                <p className="text-sm text-muted-foreground">Используйте промокод: UNIPIZZA20</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
