package com.soilmates.app

import org.junit.Test
import org.junit.Assert.assertEquals

/**
 * Android unit test written in Kotlin for Soil Mates app.
 */
class ExampleUnitTest {
    @Test
    fun addition_isCorrect() {
        assertEquals(4, 2 + 2)
    }

    @Test
    fun appIdentifier_isValid() {
        val appId = "com.soilmates.app"
        assertEquals("com.soilmates.app", appId)
    }
}
