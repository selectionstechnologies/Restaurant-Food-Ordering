import { ChevronRight, UtensilsCrossed } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { FoodDetails } from '../components/FoodDetails';
import { FoodGrid } from '../components/FoodGrid';
import { SectionHeading } from '../components/SectionHeading';
import { getCategory, getItemBySlug, getRelatedItems } from '../data/menu';
import { usePageMeta } from '../hooks/usePageMeta';

export function FoodDetailsPage() {
  const { slug = '' } = useParams();
  const item = getItemBySlug(slug);
  usePageMeta(item?.name ?? 'Dish not found', item?.description);

  if (!item) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={UtensilsCrossed}
          title="We couldn’t find that dish"
          description="It may have been removed from the menu or the link is incorrect."
          action={
            <Link to="/menu" className="btn-primary">
              Back to menu
            </Link>
          }
        />
      </div>
    );
  }

  const category = getCategory(item.category);
  const related = getRelatedItems(item, 3);

  return (
    <>
      <div className="container-page py-8 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-charcoal-500">
            {[
              { to: '/', label: 'Home' },
              { to: '/menu', label: 'Menu' },
              { to: `/menu?category=${item.category}`, label: category?.name ?? 'Category' },
            ].map((crumb) => (
              <li key={crumb.to} className="flex items-center gap-1.5">
                <Link to={crumb.to} className="hover:text-tomato">
                  {crumb.label}
                </Link>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </li>
            ))}
            <li aria-current="page" className="font-medium text-charcoal">
              {item.name}
            </li>
          </ol>
        </nav>
        {/* key resets option state when navigating between dishes */}
        <FoodDetails key={item.id} item={item} />
      </div>

      {related.length > 0 && (
        <section className="mt-12 bg-beige/50 py-16" aria-labelledby="related-heading">
          <div className="container-page">
            <SectionHeading eyebrow="You might also like" title={<span id="related-heading">Related dishes</span>} />
            <FoodGrid items={related} />
          </div>
        </section>
      )}
    </>
  );
}
