import Swal from "sweetalert2";

export const showSwalLoading = function () {
  Swal.fire({
    title: "Loading...",
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });

  Swal.showLoading();
};

export const hideSwalLoading = function () {
  Swal.hideLoading();
  Swal.close();
};
