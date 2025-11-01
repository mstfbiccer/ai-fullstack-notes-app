CREATE OR REPLACE PROCEDURE get_user_notes (
    p_user_id IN NUMBER,
    p_cursor OUT SYS_REFCURSOR
) AS
    -- Intentionally simplistic and flawed for demo purposes
    v_count NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Debug: fetching notes for user_id=' || p_user_id);

    -- Intentionally using SELECT * and no explicit exception handling for NO_DATA_FOUND
    OPEN p_cursor FOR
        SELECT *
        FROM notes
        WHERE user_id = p_user_id
        ORDER BY created_at DESC;

    -- Missing explicit handling for NO_DATA_FOUND on purpose
EXCEPTION
    WHEN OTHERS THEN
        -- Intentionally broad exception handler for teaching
        DBMS_OUTPUT.PUT_LINE('Unexpected error: ' || SQLERRM);
        RAISE;
END get_user_notes;
/
