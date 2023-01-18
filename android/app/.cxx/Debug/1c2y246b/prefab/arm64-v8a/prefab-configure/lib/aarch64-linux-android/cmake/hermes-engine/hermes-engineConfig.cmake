if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/mahitmehta/.gradle/caches/transforms-3/b5bbb7e7101af858b257d812e99ecd03/transformed/jetified-hermes-android-0.71.0-debug/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/mahitmehta/.gradle/caches/transforms-3/b5bbb7e7101af858b257d812e99ecd03/transformed/jetified-hermes-android-0.71.0-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

