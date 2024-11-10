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
      width: 100
    }));
  };

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.MyImage = MyImage;

})(React);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tcG9uZW50cy9teS1pbWFnZS50c3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQWN0aW9uUHJvcHMgfSBmcm9tICdhZG1pbmpzJ1xuXG5cbmNvbnN0IE15SW1hZ2UgPSAocHJvcHM6IEFjdGlvblByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkIH0gPSBwcm9wcztcbiAgY29uc3QgeyB0aXRsZSwgY292ZXJfaW1hZ2V9ID0gcmVjb3JkPy5wYXJhbXMgfHwge307XG5cbiAgY29uc29sZS5sb2coMTAsIHByb3BzKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICA8aW1nIHNyYz17Y292ZXJfaW1hZ2V9IGFsdD17dGl0bGV9IHdpZHRoPXsxMDB9IC8+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBNeUltYWdlO1xuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgTXlJbWFnZSBmcm9tICcuLi9zcmMvY29tcG9uZW50cy9teS1pbWFnZSdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuTXlJbWFnZSA9IE15SW1hZ2UiXSwibmFtZXMiOlsiTXlJbWFnZSIsInByb3BzIiwicmVjb3JkIiwidGl0bGUiLCJjb3Zlcl9pbWFnZSIsInBhcmFtcyIsImNvbnNvbGUiLCJsb2ciLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJzcmMiLCJhbHQiLCJ3aWR0aCIsIkFkbWluSlMiLCJVc2VyQ29tcG9uZW50cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQUlBLE1BQU1BLE9BQU8sR0FBSUMsS0FBa0IsSUFBSztJQUN0QyxNQUFNO0VBQUVDLElBQUFBO0VBQU8sR0FBQyxHQUFHRCxLQUFLO0lBQ3hCLE1BQU07TUFBRUUsS0FBSztFQUFFQyxJQUFBQTtFQUFXLEdBQUMsR0FBR0YsTUFBTSxFQUFFRyxNQUFNLElBQUksRUFBRTtFQUVsREMsRUFBQUEsT0FBTyxDQUFDQyxHQUFHLENBQUMsRUFBRSxFQUFFTixLQUFLLENBQUM7RUFFdEIsRUFBQSxvQkFDRU8sc0JBQUEsQ0FBQUMsYUFBQSxDQUNFRCxLQUFBQSxFQUFBQSxJQUFBQSxlQUFBQSxzQkFBQSxDQUFBQyxhQUFBLENBQUEsS0FBQSxFQUFBO0VBQUtDLElBQUFBLEdBQUcsRUFBRU4sV0FBWTtFQUFDTyxJQUFBQSxHQUFHLEVBQUVSLEtBQU07RUFBQ1MsSUFBQUEsS0FBSyxFQUFFO0VBQUksR0FBRSxDQUM3QyxDQUFDO0VBRVYsQ0FBQzs7RUNmREMsT0FBTyxDQUFDQyxjQUFjLEdBQUcsRUFBRTtFQUUzQkQsT0FBTyxDQUFDQyxjQUFjLENBQUNkLE9BQU8sR0FBR0EsT0FBTzs7Ozs7OyJ9
