(function (React) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  const MyImage = props => {
    const {
      record
    } = props;
    const {
      title,
      cover_image
    } = record?.params || {};
    console.log(10, props);
    return /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("img", {
      src: cover_image,
      alt: title,
      style: {
        width: '100px'
      }
    }));
  };

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.MyImage = MyImage;

})(React);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tcG9uZW50cy9teS1pbWFnZS50c3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQWN0aW9uUHJvcHMgfSBmcm9tICdhZG1pbmpzJ1xuXG5cbmNvbnN0IE15SW1hZ2UgPSAocHJvcHM6IEFjdGlvblByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkIH0gPSBwcm9wcztcbiAgY29uc3QgeyB0aXRsZSwgY292ZXJfaW1hZ2V9ID0gcmVjb3JkPy5wYXJhbXMgfHwge307XG5cbiAgY29uc29sZS5sb2coMTAsIHByb3BzKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICA8aW1nIHNyYz17Y292ZXJfaW1hZ2V9IGFsdD17dGl0bGV9IHN0eWxlPXt7IHdpZHRoOiAnMTAwcHgnIH19IC8+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBNeUltYWdlO1xuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgTXlJbWFnZSBmcm9tICcuLi9zcmMvY29tcG9uZW50cy9teS1pbWFnZSdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuTXlJbWFnZSA9IE15SW1hZ2UiXSwibmFtZXMiOlsiTXlJbWFnZSIsInByb3BzIiwicmVjb3JkIiwidGl0bGUiLCJjb3Zlcl9pbWFnZSIsInBhcmFtcyIsImNvbnNvbGUiLCJsb2ciLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJzcmMiLCJhbHQiLCJzdHlsZSIsIndpZHRoIiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0VBSUEsTUFBTUEsT0FBTyxHQUFJQyxLQUFrQixJQUFLO0lBQ3RDLE1BQU07RUFBRUMsSUFBQUE7RUFBTyxHQUFDLEdBQUdELEtBQUs7SUFDeEIsTUFBTTtNQUFFRSxLQUFLO0VBQUVDLElBQUFBO0VBQVcsR0FBQyxHQUFHRixNQUFNLEVBQUVHLE1BQU0sSUFBSSxFQUFFO0VBRWxEQyxFQUFBQSxPQUFPLENBQUNDLEdBQUcsQ0FBQyxFQUFFLEVBQUVOLEtBQUssQ0FBQztFQUV0QixFQUFBLG9CQUNFTyxzQkFBQSxDQUFBQyxhQUFBLENBQ0VELEtBQUFBLEVBQUFBLElBQUFBLGVBQUFBLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsSUFBQUEsR0FBRyxFQUFFTixXQUFZO0VBQUNPLElBQUFBLEdBQUcsRUFBRVIsS0FBTTtFQUFDUyxJQUFBQSxLQUFLLEVBQUU7RUFBRUMsTUFBQUEsS0FBSyxFQUFFO0VBQVE7RUFBRSxHQUFFLENBQzVELENBQUM7RUFFVixDQUFDOztFQ2ZEQyxPQUFPLENBQUNDLGNBQWMsR0FBRyxFQUFFO0VBRTNCRCxPQUFPLENBQUNDLGNBQWMsQ0FBQ2YsT0FBTyxHQUFHQSxPQUFPOzs7Ozs7In0=
