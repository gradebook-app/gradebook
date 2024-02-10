if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/mahitmehta/.gradle/caches/transforms-3/562b30d2482057640d59d8d304224046/transformed/jetified-hermes-android-0.71.0-debug/prefab/modules/libhermes/libs/android.x86/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/mahitmehta/.gradle/caches/transforms-3/562b30d2482057640d59d8d304224046/transformed/jetified-hermes-android-0.71.0-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

