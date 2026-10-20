import { Column, Img, Row, Section, Text } from '@react-email/components';
import { formatPrice } from '@/lib/format';
import { colors, sans, serif, text } from './EmailLayout';

export type EmailOrder = {
  number: string;
  items: { title: string; price: number; imageUrl?: string | null }[];
  amounts: { subtotal: number; shipping: number; total: number };
  shippingMethod: 'colissimo' | 'retrait';
  shippingAddress?: {
    name?: string | null;
    line1?: string | null;
    line2?: string | null;
    postalCode?: string | null;
    city?: string | null;
  } | null;
  customer: { name?: string | null; email?: string | null; phone?: string | null };
};

const cell = { ...text, margin: 0 };

export function OrderSummary({ order }: { order: EmailOrder }) {
  return (
    <Section style={{ margin: '8px 0 20px' }}>
      {order.items.map((item) => (
        <Row key={item.title} style={{ borderBottom: `1px solid ${colors.border}` }}>
          {item.imageUrl && (
            <Column style={{ width: '72px', padding: '12px 12px 12px 0' }}>
              <Img
                src={item.imageUrl}
                alt=""
                width="60"
                height="75"
                style={{ backgroundColor: colors.sand }}
              />
            </Column>
          )}
          <Column style={{ padding: '12px 0' }}>
            <Text style={{ ...cell, fontFamily: serif, fontSize: '19px' }}>{item.title}</Text>
          </Column>
          <Column align="right" style={{ padding: '12px 0', whiteSpace: 'nowrap' }}>
            <Text style={cell}>{formatPrice(item.price)}</Text>
          </Column>
        </Row>
      ))}
      <Row>
        <Column style={{ paddingTop: '12px' }}>
          <Text style={{ ...cell, color: colors.muted }}>Livraison</Text>
        </Column>
        <Column align="right" style={{ paddingTop: '12px' }}>
          <Text style={{ ...cell, color: colors.muted }}>
            {formatPrice(order.amounts.shipping)}
          </Text>
        </Column>
      </Row>
      <Row>
        <Column style={{ paddingTop: '6px' }}>
          <Text style={{ ...cell, fontFamily: sans, fontSize: '17px' }}>Total</Text>
        </Column>
        <Column align="right" style={{ paddingTop: '6px' }}>
          <Text style={{ ...cell, fontSize: '17px', color: colors.cognac }}>
            {formatPrice(order.amounts.total)}
          </Text>
        </Column>
      </Row>
    </Section>
  );
}

export function AddressBlock({ order }: { order: EmailOrder }) {
  if (order.shippingMethod === 'retrait') {
    return (
      <Text style={text}>
        Retrait dans la Vaunage : nous convenons ensemble du jour et du lieu.
      </Text>
    );
  }
  const a = order.shippingAddress;
  if (!a) return null;
  return (
    <Text style={text}>
      {[a.name, a.line1, a.line2, [a.postalCode, a.city].filter(Boolean).join(' ')]
        .filter(Boolean)
        .map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
    </Text>
  );
}
