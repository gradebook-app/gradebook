if(NOT TARGET fbjni::fbjni)
add_library(fbjni::fbjni SHARED IMPORTED)
set_target_properties(fbjni::fbjni PROPERTIES
    IMPORTED_LOCATION "/Users/mahitmehta/.gradle/caches/transforms-3/efffb56ded880100cd69b011d7e718c8/transformed/jetified-fbjni-0.3.0/prefab/modules/fbjni/libs/android.arm64-v8a/libfbjni.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/mahitmehta/.gradle/caches/transforms-3/efffb56ded880100cd69b011d7e718c8/transformed/jetified-fbjni-0.3.0/prefab/modules/fbjni/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

