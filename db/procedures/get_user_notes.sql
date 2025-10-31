CREATE OR REPLACE PROCEDURE get_user_notes (
    p_user_id IN NUMBER
) AS
    -- Intentionally simplistic and flawed for demo purposes
    v_count NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Debug: fetching notes for user_id=' || p_user_id);

    -- Intentionally using SELECT * and no explicit exception handling for NO_DATA_FOUND
    FOR rec IN (
        SELECT *
        FROM notes
        WHERE user_id = p_user_id
        ORDER BY created_at DESC
    ) LOOP
        -- Normally you'd do something with the record or return via out params
        DBMS_OUTPUT.PUT_LINE('Note ID: ' || rec.id || ' | Title: ' || rec.title);
    END LOOP;

    -- Missing explicit handling for NO_DATA_FOUND on purpose
EXCEPTION
    WHEN OTHERS THEN
        -- Intentionally broad exception handler for teaching
        DBMS_OUTPUT.PUT_LINE('Unexpected error: ' || SQLERRM);
END get_user_notes;
/
