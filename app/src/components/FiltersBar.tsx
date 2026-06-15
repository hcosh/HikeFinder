import type { HikeFilters } from "../types";

interface Props {
  filters: HikeFilters;
  onChange: (next: HikeFilters) => void;
  onReset: () => void;
}

export default function FiltersBar({ filters, onChange, onReset }: Props) {
  return (
    <section className="card filters">
      <div className="filter-row">
        <label>
          Difficulty
          <select
            value={filters.difficulty}
            onChange={(e) =>
              onChange({ ...filters, difficulty: e.target.value as HikeFilters["difficulty"] })
            }
          >
            <option value="all">All</option>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <label>
          Minimum rating
          <input
            type="number"
            min={1}
            max={5}
            step={0.1}
            value={filters.minRating}
            onChange={(e) => onChange({ ...filters, minRating: Number(e.target.value) })}
          />
        </label>
      </div>
      <div className="filter-row">
        <label>
          Max hours
          <input
            type="number"
            min={1}
            max={12}
            value={filters.maxHours}
            onChange={(e) => onChange({ ...filters, maxHours: Number(e.target.value) })}
          />
        </label>

        <label>
          Max distance (km)
          <input
            type="number"
            min={1}
            max={30}
            value={filters.maxDistanceKm}
            onChange={(e) => onChange({ ...filters, maxDistanceKm: Number(e.target.value) })}
          />
        </label>
      </div>
      <button type="button" onClick={onReset} className="secondary">
        Reset filters
      </button>
    </section>
  );
}