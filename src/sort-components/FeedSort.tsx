import { useState, useEffect, useContext, useRef } from "react";
import categories from "../staticdata/Categories";
import { GlobalContext, UserContext } from "../App";

const feedSortOptions: { id: number; option: string }[] = [
  {
    id: 1,
    option: "top",
  },
  {
    id: 2,
    option: "low",
  },
  {
    id: 3,
    option: "new",
  },
  {
    id: 4,
    option: "old",
  },
];

type SelectionProps = {
  dropdownSelection: (selectionTitle: string, selectionId: number) => void;
};

type CategoryDropdownProps = {
  categorySortSelection?: (result: string) => void;
  categoryTitleSelection?: (selectionTitle: string) => void;
};

//sort dropdown

export const FeedSortDropdown = ({ dropdownSelection }: SelectionProps) => {
  const { darkActive } = useContext<GlobalContext>(UserContext);

  useEffect(() => {
    darkActive == !false ? window.darkMode() : null;
  }, []);
  return (
    <>
      {feedSortOptions.map((option) => (
        <section
          id="feed__sort--option"
          key={option.id}
          onClick={(e) => {
            dropdownSelection(option.option, option.id);
            e.currentTarget.parentElement?.parentElement?.blur();
          }}
        >
          <p>{option.option}</p>
        </section>
      ))}
    </>
  );
};

//category sort user posts only

export const CategoryDropdown = ({
  categorySortSelection,
  categoryTitleSelection,
}: CategoryDropdownProps) => {
  const { darkActive } = useContext<GlobalContext>(UserContext);

  useEffect(() => {
    darkActive == !false ? window.darkMode() : null;
  }, []);
  return (
    <>
      {categories.map((data) => (
        <section
          className="category__option"
          key={data.id}
          onClick={(e) => {
            categoryTitleSelection!(data.title);
            categorySortSelection ? categorySortSelection!(data.title) : null;

            e.currentTarget.parentElement?.parentElement?.blur();
          }}
        >
          <i className={data.icon}></i> <h5>{data.title}</h5>
        </section>
      ))}
    </>
  );
};

type SortProps = {
  sortOption: (selection: number) => void;
  selectedCategory?: string;
  userPosts?: boolean;
  categorySortSelection?: (result: string) => void;
};

const FeedSort = ({
  sortOption,
  selectedCategory,
  categorySortSelection,
  userPosts,
}: SortProps) => {
  const [active, setActive] = useState<boolean>(false);
  const [categoryActive, setCategoryActive] = useState<boolean>(false);
  const [selectionTitle, setSelectionTitle] = useState<string>("top");
  const [categoryTitle, setCategoryTitle] = useState<string>("");
  const { darkActive } = useContext<GlobalContext>(UserContext);
  const onFocus = () => setActive(!false);
  const onBlur = () => setActive(false);
  const onCategoryFocus = () => setCategoryActive(!false);
  const onCategoryBlur = () => setCategoryActive(false);
  const sortRef = useRef<any>();
  const categoryRef = useRef<any>();

  window.addEventListener("mousedown", (e) => {
    if (active && !sortRef.current?.includes(e.target)) {
      setActive(false);
    }

    if (categoryActive && !categoryRef.current?.includes(e.target)) {
      setCategoryActive(false);
    }
  });

  const dropdownSelection = (selectionTitle: string, selectionId: number) => {
    setSelectionTitle(selectionTitle);
    sortOption(selectionId);
    setActive(false);
  };

  const categorySelection = (selectionTitle: string) => {
    setCategoryTitle(selectionTitle);
    setCategoryActive(false);
  };

  useEffect(() => {
    setSelectionTitle("top");
  }, [selectedCategory]);

  return (
    <>
      <div className="feed__sort--container">
        <div className="feed__sort--dropdown--container">
          <button
            onFocus={onFocus}
            onBlur={onBlur}
            className="feed__dropdown--button"
            onClick={() => setActive(!false)}
          >
            <p>{selectionTitle}</p> <i className="fa-solid fa-chevron-down"></i>
            {active == !false ? (
              <div className="feed__sort--dropdown" ref={sortRef}>
                <FeedSortDropdown dropdownSelection={dropdownSelection} />
              </div>
            ) : null}
          </button>
        </div>
        {userPosts == true ? (
          <div className="feed__sort--dropdown--container">
            <button
              className="feed__dropdown--button category__sort--button"
              onFocus={onCategoryFocus}
              onBlur={onCategoryBlur}
              onClick={() => setCategoryActive(!false)}
            >
              {categoryTitle == "" ? (
                <p>Category</p>
              ) : (
                <p>Category - {categoryTitle}</p>
              )}

              <i className="fa-solid fa-chevron-down"></i>
              {categoryActive == !false ? (
                <div
                  className="feed__category--sort--dropdown"
                  ref={categoryRef}
                >
                  <CategoryDropdown
                    categorySortSelection={categorySortSelection}
                    categoryTitleSelection={categorySelection}
                  />
                </div>
              ) : null}
            </button>
          </div>
        ) : null}

        <button id="reset__filters" onClick={() => window.location.reload()}>
          <p
            style={
              darkActive == !false ? { color: "var(--white-DM)" } : undefined
            }
          >
            Reset filters
          </p>
        </button>
      </div>
    </>
  );
};
export default FeedSort;
