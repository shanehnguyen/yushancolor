import Link from "next/link";
import type { Pigment, Product } from "@/lib/types";
import { descriptorFor, money, pigmentsById, productUrl } from "@/lib/data";
import { Swatch } from "@/components/Swatch";
import { TinGrid } from "@/components/TinGrid";
import { AddToCartButton } from "@/components/AddToCartButton";

export function PigmentCard({ pigment }: { pigment: Pigment }) {
  return (
    <div className="product-card collection-card">
      <Link className="collection-card__link" href={productUrl("single-pan", pigment.id)}>
        <div className="collection-card__img collection-card__img--swatch">
          <span className="collection-card__tag">{pigment.granulation}</span>
          <div className="layer main">
            <Swatch pigment={pigment} fill />
          </div>
          <div className="layer alt">Swatched on cold-press paper</div>
        </div>
        <div className="product-card__rung">
          {pigment.ci}
          {pigment.house ? <span className="house-tag"> · House mineral</span> : null}
        </div>
        <div className="product-card__name">{pigment.name}</div>
        <div className="product-card__desc">{descriptorFor(pigment)}</div>
        <div className="product-card__price">$11.00</div>
      </Link>
      <AddToCartButton
        item={{ productId: "single-pan", variantId: pigment.id, name: `${pigment.name}, Single Pan`, unitPrice: 11, variantLabel: pigment.ci }}
        label="Add to cart"
        className="btn btn-outline btn-block"
      />
    </div>
  );
}

export function SetCard({ product }: { product: Product }) {
  return (
    <div className="product-card collection-card">
      <Link className="collection-card__link" href={productUrl(product.id)}>
        <div className="collection-card__img">
          <TinGrid pigmentIds={product.includesPigments || []} pigmentsById={pigmentsById} />
        </div>
        <div className="product-card__rung">{product.rung}</div>
        <div className="product-card__name">{product.name}</div>
        <div className="product-card__desc">{product.shortDescription || ""}</div>
        <div className="product-card__price">{money(product.price)}</div>
      </Link>
      <AddToCartButton
        item={{ productId: product.id, variantId: null, name: product.name, unitPrice: product.price, variantLabel: product.format }}
        label="Add to cart"
        className="btn btn-outline btn-block"
      />
    </div>
  );
}

export function RelatedProductCard({ product }: { product: Product }) {
  return (
    <Link className="product-card related-card" href={productUrl(product.id)}>
      <div className="product-card__img">
        {product.includesPigments && product.includesPigments.length ? (
          <TinGrid pigmentIds={product.includesPigments} pigmentsById={pigmentsById} max={8} />
        ) : (
          <div className="pattern-tile" style={{ opacity: 0.7 }} />
        )}
      </div>
      <div className="product-card__rung">{product.rung}</div>
      <div className="product-card__name">{product.name}</div>
      <div className="product-card__desc">{product.shortDescription || ""}</div>
      <div className="product-card__price">{money(product.price)}</div>
    </Link>
  );
}
