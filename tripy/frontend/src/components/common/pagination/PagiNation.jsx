// import styles from "./PageNation.module.scss";
// const PageNation = () => {
//   const moveToPage = () => {};
//   const moveToNext = () => {};
//   const moveToPrev = () => {};
//   let page = 1;
//   let step = 1;
//   let divide = 1;
//   const res = []; //=>Map으로
//   return (
//     <div>
//       <div className={styles.pagination}>
//         {step > 0 && (
//           <button className={styles.pagination__button} onClick={moveToPrev}>
//             {/* <img src="../../assets/icons/icon-arrowLeft.svg" alt="Left" /> */}
//             <img src="public/assets/icons/icon-arrowLeft.svg" alt="Left" />
//           </button>
//         )}
//         {/* 변경될 UI 부분 */}
//         {/* <span>1</span> */}
//         {res[step]?.map((item, index) => {
//           if (item < 11) {
//             return (
//               <button
//                 className={
//                   index === page - 1
//                     ? `${styles.pagination__button} ${styles.active}`
//                     : `${styles.pagination__button} ${styles.inactive}`
//                 }
//                 key={item}
//                 onClick={() => {
//                   moveToPage(item);
//                 }}
//               >
//                 {item}
//               </button>
//             );
//           } else {
//             return (
//               <button
//                 className={
//                   index === page - 1 - step * 10
//                     ? `${styles.pagination__button} ${styles.active}`
//                     : `${styles.pagination__button} ${styles.inactive}`
//                 }
//                 key={item}
//                 onClick={() => {
//                   moveToPage(item);
//                 }}
//               >
//                 {item}
//               </button>
//             );
//           }
//         })}
//         {step < divide - 1 && (
//           <button className={styles.pagination__button} onClick={moveToNext}>
//             <img src="public/assets/icons/icon-arrowRight.svg" alt="Right" />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };
// export default PageNation;
// components/Pagination.jsx

import { usePaginationStore } from "../../../store/paginationStore";

function Pagination() {
  const { currentPage, totalPages, setPage, nextPage, prevPage } =
    usePaginationStore();

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button onClick={prevPage} disabled={currentPage === 1}>
        <img src="../../assets/icons/icon-arrowLeft.svg" alt="Left" />
      </button>

      {/* 페이지 번호 표시 */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setPage(page)}
          style={{
            fontWeight: currentPage === page ? "bold" : "normal",
          }}
        >
          {page}
        </button>
      ))}

      <button onClick={nextPage} disabled={currentPage === totalPages}>
        <img src="../../assets/icons/icon-arrowRight.svg" alt="Right" />
      </button>
    </div>
  );
}

export default Pagination;
